#!/usr/bin/env tsx

/**
 * Exemplo de upload de arquivo para o Cloudflare R2
 *
 * Uso:
 *   npm run upload:example
 *
 * Este é apenas um exemplo. Para uso real, você pode:
 * 1. Fazer upload via dashboard do Cloudflare R2
 * 2. Usar este script como base para uploads programáticos
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

async function uploadExample() {
  const { uploadFileToR2, generateR2Key } = await import('../lib/r2')

  console.log('📤 Exemplo de upload para Cloudflare R2\n')

  // Exemplo 1: Upload de texto simples
  console.log('1️⃣ Criando arquivo de exemplo...')
  const exampleText = `
# Material Complementar - Exemplo

Este é um arquivo de exemplo que demonstra como fazer upload para o Cloudflare R2.

## Como usar na aplicação

Depois de fazer upload deste arquivo, use a URL no formato:
r2://pdfs/exemplo.txt

## Próximos passos

1. Faça upload dos seus arquivos reais (PDFs, áudios, vídeos)
2. Atualize o banco de dados com as URLs no formato r2://
3. Acesse via dashboard da aplicação

---
Data: ${new Date().toISOString()}
`

  const key = generateR2Key('pdf', 'exemplo.txt')

  console.log(`✅ Chave gerada: ${key}\n`)

  console.log('2️⃣ Fazendo upload...')
  await uploadFileToR2({
    key: key,
    body: exampleText,
    contentType: 'text/plain',
    metadata: {
      'upload-type': 'example',
      'created-at': new Date().toISOString(),
    }
  })

  console.log(`✅ Upload realizado com sucesso!\n`)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📝 Como usar este arquivo na aplicação:')
  console.log(`   content_url: "r2://${key}"`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Exemplo 2: Upload de arquivo local (se existir)
  console.log('💡 Dica: Para fazer upload de arquivo local:')
  console.log(`
const fileBuffer = readFileSync('caminho/para/arquivo.pdf')
const key = generateR2Key('pdf', 'meu-arquivo.pdf')

await uploadFileToR2({
  key: key,
  body: fileBuffer,
  contentType: 'application/pdf',
})

console.log(\`Arquivo disponível em: r2://\${key}\`)
  `)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🌐 Ou faça upload via Dashboard do Cloudflare:')
  console.log('   1. Acesse: https://dash.cloudflare.com')
  console.log('   2. Navegue para R2 → Seu bucket (lt-neuroreset)')
  console.log('   3. Clique em "Upload" e selecione seus arquivos')
  console.log('   4. Use r2://pasta/arquivo.ext no banco de dados')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

uploadExample()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
