import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configuração do cliente R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lt-neuroreset'

// Endpoint do Cloudflare R2
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

// Cliente S3 configurado para R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

/**
 * Extrai o bucket e a chave de uma URL no formato r2://bucket-name/path/file.ext
 * Suporta também o formato legado r2://path/file.ext (usa bucket padrão)
 */
export function parseR2Url(url: string): { bucket: string; key: string } {
  // Remove o prefixo r2://
  const path = url.replace('r2://', '')

  // Verifica se há um bucket explícito (r2://bucket-name/path/file.ext)
  const parts = path.split('/')

  // Lista de nomes de pastas conhecidas (não são nomes de bucket)
  const knownFolders = ['pdfs', 'audios', 'videos', 'images', 'thumbnails']

  // Se o primeiro segmento não é uma pasta conhecida e não contém extensão de arquivo,
  // trata como bucket explícito
  if (parts.length > 1 && !parts[0].includes('.') && !knownFolders.includes(parts[0].toLowerCase())) {
    const bucket = parts[0]
    const key = parts.slice(1).join('/')
    return { bucket, key }
  }

  // Caso contrário, usa o bucket padrão (formato legado: r2://path/file.ext)
  return { bucket: R2_BUCKET_NAME, key: path }
}

export interface UploadFileParams {
  key: string
  body: Buffer | Uint8Array | string
  contentType?: string
  metadata?: Record<string, string>
}

export interface GetFileParams {
  key: string
  expiresIn?: number // segundos (padrão: 3600 = 1 hora)
  bucket?: string // bucket opcional
}

/**
 * Faz upload de um arquivo para o R2
 */
export async function uploadFileToR2(params: UploadFileParams): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
    Metadata: params.metadata,
  })

  await r2Client.send(command)
}

/**
 * Gera uma URL assinada (signed URL) para acesso temporário a um arquivo no R2
 * @param params - Parâmetros incluindo key (pode ser r2://bucket/path ou path), bucket opcional, e expiresIn
 */
export async function getSignedFileUrl(params: GetFileParams): Promise<string> {
  let finalBucket = params.bucket || R2_BUCKET_NAME
  let finalKey = params.key

  // Se for uma URL r2://, fazer parsing
  if (params.key.startsWith('r2://')) {
    const parsed = parseR2Url(params.key)
    finalBucket = parsed.bucket
    finalKey = parsed.key
  }

  const command = new GetObjectCommand({
    Bucket: finalBucket,
    Key: finalKey,
  })

  const url = await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresIn || 3600, // 1 hora por padrão
  })

  return url
}

/**
 * Obtém o conteúdo de um arquivo do R2
 * @param keyOrUrl - Pode ser uma chave simples (path/file.ext) ou URL completa (r2://bucket/path/file.ext)
 * @param bucket - Bucket opcional. Se não fornecido, usa o bucket da URL ou o padrão
 */
export async function getFileFromR2(keyOrUrl: string, bucket?: string): Promise<Buffer> {
  let finalBucket = bucket || R2_BUCKET_NAME
  let finalKey = keyOrUrl

  // Se for uma URL r2://, fazer parsing
  if (keyOrUrl.startsWith('r2://')) {
    const parsed = parseR2Url(keyOrUrl)
    finalBucket = parsed.bucket
    finalKey = parsed.key
  }

  const command = new GetObjectCommand({
    Bucket: finalBucket,
    Key: finalKey,
  })

  const response = await r2Client.send(command)

  if (!response.Body) {
    throw new Error('File not found')
  }

  // Converter stream para buffer
  const chunks: Uint8Array[] = []
  // @ts-expect-error - Body pode ser um stream
  for await (const chunk of response.Body) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

/**
 * Deleta um arquivo do R2
 */
export async function deleteFileFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}

/**
 * Lista arquivos no R2
 */
export async function listFilesInR2(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix,
  })

  const response = await r2Client.send(command)

  return response.Contents?.map(item => item.Key || '') || []
}

/**
 * Verifica se as credenciais do R2 estão configuradas
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
}

/**
 * Gera uma chave (key) padronizada para armazenamento no R2
 */
export function generateR2Key(type: 'audio' | 'video' | 'pdf' | 'image', filename: string): string {
  const timestamp = Date.now()
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${type}s/${timestamp}-${sanitized}`
}
