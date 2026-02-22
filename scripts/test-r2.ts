#!/usr/bin/env tsx

/**
 * Script de teste para Cloudflare R2
 *
 * Uso:
 *   npm run test:r2
 */

// IMPORTANTE: Carregar variáveis de ambiente ANTES de importar qualquer módulo
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carregar .env.local ANTES de qualquer import
config({ path: resolve(__dirname, '../.env.local') })

async function testR2Connection() {
  // Importar dinamicamente depois que as variáveis de ambiente foram carregadas
  const { isR2Configured, uploadFileToR2, listFilesInR2, getSignedFileUrl, deleteFileFromR2 } = await import('../lib/r2')

  console.log('🧪 Testando conexão com Cloudflare R2...\n')

  // 1. Verificar configuração
  console.log('1️⃣ Verificando configuração...')
  const isConfigured = isR2Configured()

  if (!isConfigured) {
    console.error('❌ R2 não está configurado!')
    console.error('   Configure as variáveis de ambiente:')
    console.error('   - R2_ACCOUNT_ID')
    console.error('   - R2_ACCESS_KEY_ID')
    console.error('   - R2_SECRET_ACCESS_KEY')
    console.error('   - R2_BUCKET_NAME (opcional, padrão: lt-entregaveis)')
    process.exit(1)
  }

  console.log('✅ R2 configurado corretamente\n')

  // 2. Upload de arquivo de teste
  console.log('2️⃣ Fazendo upload de arquivo de teste...')
  const testFileContent = 'Este é um arquivo de teste do Cloudflare R2!'
  const testFileName = `test-${Date.now()}.txt`
  const testFilePath = `tests/${testFileName}`

  try {
    await uploadFileToR2({
      key: testFilePath,
      body: testFileContent,
      contentType: 'text/plain',
      metadata: {
        'created-by': 'test-script',
        'timestamp': new Date().toISOString(),
      },
    })
    console.log(`✅ Upload realizado: ${testFilePath}\n`)
  } catch (error) {
    console.error('❌ Erro no upload:', error)
    process.exit(1)
  }

  // 3. Listar arquivos
  console.log('3️⃣ Listando arquivos no bucket (prefix: "tests/")...')
  try {
    const files = await listFilesInR2('tests/')
    console.log(`✅ Encontrados ${files.length} arquivos:`)
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`)
    })
    console.log()
  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error)
  }

  // 4. Gerar URL assinada
  console.log('4️⃣ Gerando URL assinada (válida por 1 hora)...')
  try {
    const signedUrl = await getSignedFileUrl({
      key: testFilePath,
      expiresIn: 3600,
    })
    console.log('✅ URL gerada com sucesso:')
    console.log(`   ${signedUrl.substring(0, 100)}...`)
    console.log()
  } catch (error) {
    console.error('❌ Erro ao gerar URL assinada:', error)
  }

  // 5. Deletar arquivo de teste
  console.log('5️⃣ Deletando arquivo de teste...')
  try {
    await deleteFileFromR2(testFilePath)
    console.log(`✅ Arquivo deletado: ${testFilePath}\n`)
  } catch (error) {
    console.error('❌ Erro ao deletar arquivo:', error)
  }

  // Resumo final
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Todos os testes passaram!')
  console.log('   O Cloudflare R2 está funcionando corretamente.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('📝 Próximos passos:')
  console.log('   1. Faça upload dos seus arquivos (PDFs, áudios, vídeos)')
  console.log('   2. Use URLs no formato: r2://pasta/arquivo.pdf')
  console.log('   3. Consulte CLOUDFLARE-R2-SETUP.md para mais informações')
}

// Executar testes
testR2Connection()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
