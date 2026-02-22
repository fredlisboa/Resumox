#!/usr/bin/env tsx

/**
 * Lista todos os arquivos no Cloudflare R2
 *
 * Uso:
 *   npm run list:r2
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

async function listR2Files() {
  const { listFilesInR2, isR2Configured } = await import('../lib/r2')

  console.log('📂 Listando arquivos no Cloudflare R2...\n')

  if (!isR2Configured()) {
    console.error('❌ R2 não está configurado!')
    process.exit(1)
  }

  try {
    // Listar por tipo
    const folders = ['audios', 'videos', 'pdfs', 'images', 'tests']

    for (const folder of folders) {
      console.log(`\n📁 ${folder.toUpperCase()}/`)
      console.log('━'.repeat(80))

      const files = await listFilesInR2(`${folder}/`)

      if (files.length === 0) {
        console.log('   (vazio)')
        continue
      }

      files.forEach((file, index) => {
        const fileName = file.split('/').pop()
        console.log(`   ${index + 1}. ${fileName}`)
        console.log(`      URL: r2://${file}`)
      })
    }

    console.log('\n━'.repeat(80))
    console.log('\n💡 Para usar na aplicação, copie a URL no formato:')
    console.log('   content_url: "r2://audios/Track01_El_Despertar_Energético_Manhã.mp3"')
    console.log('\n📝 Veja scripts/add-r2-audios.sql para exemplos de INSERT')

  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error)
    process.exit(1)
  }
}

listR2Files()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
