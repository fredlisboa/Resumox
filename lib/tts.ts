import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
// R2 importado dinamicamente para garantir que env vars estejam carregadas
// (mesmo padrão usado no resumox-import-pipeline.ts)

const execFileAsync = promisify(execFile)

// ============================================================
// Configuration
// ============================================================

export const DEFAULT_VOICE = 'pt-BR-AntonioNeural'
const EDGE_TTS_BIN = process.env.EDGE_TTS_PATH || '/home/fredlisboa/miniconda3/envs/resumox/bin/edge-tts'
const EDGE_TTS_TIMEOUT_MS = 120_000
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 5_000

// ============================================================
// HTML → Plain Text
// ============================================================

/**
 * Converte summary_html em texto limpo para TTS.
 * Insere quebras de linha em pontos estruturais para pausas naturais na narração.
 */
export function htmlToPlainText(html: string): string {
  let text = html

  // Inserir quebras de parágrafo antes de remover tags
  text = text.replace(/<\/h[1-6]>/gi, '\n\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/div>/gi, '\n')
  text = text.replace(/<li>/gi, '- ')
  text = text.replace(/<\/li>/gi, '\n')

  // Remover todas as tags HTML restantes
  text = text.replace(/<[^>]+>/g, '')

  // Decodificar entidades HTML
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&mdash;/g, '—')
  text = text.replace(/&ndash;/g, '–')
  text = text.replace(/&hellip;/g, '...')
  text = text.replace(/&#\d+;/g, '') // remover entidades numéricas restantes

  // Colapsar espaços
  text = text.replace(/[ \t]+/g, ' ')
  text = text.replace(/\n{3,}/g, '\n\n')

  // Limpar linhas com apenas espaços
  text = text.replace(/\n +\n/g, '\n\n')

  return text.trim()
}

// ============================================================
// Edge TTS Audio Generation
// ============================================================

/**
 * Gera áudio MP3 usando edge-tts (Python) via subprocess.
 * @param text - Texto limpo para narrar
 * @param outputPath - Caminho do arquivo MP3 de saída
 * @param voice - Voz Edge TTS (padrão: pt-BR-AntonioNeural)
 */
export async function generateAudioWithEdgeTTS(
  text: string,
  outputPath: string,
  voice: string = DEFAULT_VOICE
): Promise<void> {
  // Escrever texto em arquivo temporário (evita problemas com shell escaping)
  const textPath = outputPath.replace(/\.mp3$/, '.txt')
  writeFileSync(textPath, text, 'utf-8')

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await execFileAsync(EDGE_TTS_BIN, [
        '--voice', voice,
        '--file', textPath,
        '--write-media', outputPath,
      ], {
        timeout: EDGE_TTS_TIMEOUT_MS,
      })

      // Verificar se o arquivo foi criado
      if (!existsSync(outputPath)) {
        throw new Error('edge-tts não gerou o arquivo de saída')
      }

      // Limpar arquivo de texto temporário
      try { unlinkSync(textPath) } catch { /* ignore */ }
      return
    } catch (err) {
      lastError = err as Error
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * attempt
        console.warn(`  [TTS] Tentativa ${attempt}/${MAX_RETRIES} falhou, retentando em ${delay / 1000}s...`)
        await sleep(delay)
      }
    }
  }

  // Limpar arquivo de texto em caso de falha
  try { unlinkSync(textPath) } catch { /* ignore */ }
  throw new Error(`edge-tts falhou após ${MAX_RETRIES} tentativas: ${lastError?.message}`)
}

// ============================================================
// Audio Duration (via ffprobe)
// ============================================================

/**
 * Obtém a duração de um arquivo MP3 em minutos usando ffprobe.
 */
export async function getAudioDurationMinutes(mp3Path: string): Promise<number> {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      mp3Path,
    ], { timeout: 10_000 })

    const seconds = parseFloat(stdout.trim())
    if (isNaN(seconds)) {
      throw new Error('ffprobe retornou duração inválida')
    }
    return Math.round(seconds / 60) // inteiro (coluna DB é integer)
  } catch (err) {
    // Fallback: estimar pelo tamanho do arquivo (edge-tts usa ~192kbps)
    console.warn('  [TTS] ffprobe não disponível, estimando duração pelo tamanho do arquivo')
    const stats = readFileSync(mp3Path)
    const fileSizeBytes = stats.length
    const estimatedSeconds = (fileSizeBytes * 8) / (192 * 1000)
    return Math.max(1, Math.round(estimatedSeconds / 60)) // mínimo 1 min
  }
}

// ============================================================
// Full Pipeline
// ============================================================

export interface TTSGenerationResult {
  r2Key: string
  durationMin: number
  fileSizeBytes: number
  textLength: number
}

export interface TTSGenerationOptions {
  dryRun?: boolean
  skipUpload?: boolean
  voice?: string
  /** Supabase client - se não fornecido, importa de ./supabase */
  supabase?: any
}

/**
 * Pipeline completo de geração de áudio para um livro:
 * HTML → texto → edge-tts MP3 → upload R2 → update DB
 */
export async function generateAudioForBook(
  slug: string,
  bookId: string,
  summaryHtml: string,
  options: TTSGenerationOptions = {}
): Promise<TTSGenerationResult> {
  const voice = options.voice || DEFAULT_VOICE
  const r2Key = `resumox/audios/${slug}.mp3`
  const r2DbKey = `r2://${r2Key}`
  const mp3Path = join(tmpdir(), `tts-${slug}.mp3`)

  try {
    // 1. Converter HTML para texto limpo
    const plainText = htmlToPlainText(summaryHtml)
    if (plainText.length < 100) {
      throw new Error(`Texto muito curto para gerar áudio (${plainText.length} chars)`)
    }

    if (options.dryRun) {
      return {
        r2Key: r2DbKey,
        durationMin: 0,
        fileSizeBytes: 0,
        textLength: plainText.length,
      }
    }

    // 2. Gerar MP3 via edge-tts
    await generateAudioWithEdgeTTS(plainText, mp3Path, voice)

    // 3. Calcular duração
    const durationMin = await getAudioDurationMinutes(mp3Path)

    // 4. Ler arquivo para upload
    const mp3Buffer = readFileSync(mp3Path)
    const fileSizeBytes = mp3Buffer.length

    if (!options.skipUpload) {
      // 5. Upload para R2 (dynamic import — env vars must be loaded first)
      const { uploadFileToR2 } = await import('./r2')
      await uploadFileToR2({
        key: r2Key,
        body: mp3Buffer,
        contentType: 'audio/mpeg',
        metadata: {
          'book-slug': slug,
          'voice': voice,
          'generated-at': new Date().toISOString(),
        },
      })

      // 6. Atualizar DB
      if (options.supabase) {
        const { error } = await options.supabase
          .from('resumox_books')
          .update({
            audio_r2_key: r2DbKey,
            audio_duration_min: durationMin,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookId)

        if (error) {
          throw new Error(`Falha ao atualizar DB: ${error.message}`)
        }
      }
    }

    return {
      r2Key: r2DbKey,
      durationMin,
      fileSizeBytes,
      textLength: plainText.length,
    }
  } finally {
    // Cleanup temp files
    try { unlinkSync(mp3Path) } catch { /* ignore */ }
    try { unlinkSync(mp3Path.replace(/\.mp3$/, '.txt')) } catch { /* ignore */ }
  }
}

// ============================================================
// Helpers
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Verifica se os pré-requisitos para TTS estão disponíveis.
 * Retorna um array de erros (vazio se tudo OK).
 */
export async function checkTTSPrerequisites(): Promise<string[]> {
  const errors: string[] = []

  // Verificar edge-tts
  try {
    await execFileAsync(EDGE_TTS_BIN, ['--version'], { timeout: 5_000 })
  } catch {
    errors.push('edge-tts não encontrado. Instale com: pip install edge-tts')
  }

  // Verificar ffprobe (opcional - tem fallback)
  try {
    await execFileAsync('ffprobe', ['-version'], { timeout: 5_000 })
  } catch {
    errors.push('ffprobe não encontrado (opcional). Instale com: sudo apt install ffmpeg')
  }

  return errors
}
