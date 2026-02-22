#!/usr/bin/env tsx

/**
 * Script para testar o acesso ao PDF no R2
 *
 * Uso:
 *   npm run test:pdf
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

async function testPdfAccess() {
  const { getFileFromR2, isR2Configured } = await import('../lib/r2')

  console.log('🧪 Testando acesso ao PDF no R2...\n')

  if (!isR2Configured()) {
    console.error('❌ R2 não está configurado!')
    process.exit(1)
  }

  const pdfKey = 'pdfs/Relatório_InfoDental-76.pdf'

  try {
    console.log(`📄 Tentando acessar: ${pdfKey}`)

    const fileBuffer = await getFileFromR2(pdfKey)

    console.log('✅ PDF acessado com sucesso!')
    console.log(`   Tamanho: ${(fileBuffer.byteLength / 1024).toFixed(2)} KB`)
    console.log(`   Primeiros bytes: ${Array.from(new Uint8Array(fileBuffer.slice(0, 10))).join(', ')}`)

    // Verificar se é um PDF válido (deve começar com %PDF)
    const header = new TextDecoder().decode(fileBuffer.slice(0, 4))
    if (header === '%PDF') {
      console.log('✅ Arquivo é um PDF válido (header: %PDF)')
    } else {
      console.log(`⚠️  Aviso: Header inesperado: ${header}`)
    }

    console.log('\n💡 URLs para usar na aplicação:')
    console.log(`   1. R2 protocol: r2://${pdfKey}`)
    console.log(`   2. API endpoint: /api/r2-content?key=${encodeURIComponent(pdfKey)}`)
    console.log(`   3. URL pública: https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/${pdfKey}`)

  } catch (error) {
    console.error('❌ Erro ao acessar PDF:', error)
    process.exit(1)
  }
}

testPdfAccess()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
