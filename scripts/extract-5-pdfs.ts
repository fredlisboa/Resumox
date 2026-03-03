import { resolve } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const files = [
  'Start With No.PDF',
  'Seven Years to Seven Figures.pdf',
  'Sacred Cows Make the Best Burgers.pdf',
  'Power Thinking.pdf',
  'Powerful Conversations.pdf',
]

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(readFileSync(pdfPath))
  const doc = await pdfjsLib.getDocument({ data }).promise
  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item: any) => item.str).join(' ')
    pages.push(text)
  }
  return pages.join('\n\n')
}

const outDir = '/tmp/resumox-extracts'
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

async function main() {
  for (const file of files) {
    const pdfPath = resolve('pdfs', file)
    console.log(`Extracting: ${file}...`)
    try {
      const text = await extractTextFromPDF(pdfPath)
      const slug = file.replace(/\.pdf$/i, '').replace(/\s+/g, '-').toLowerCase()
      writeFileSync(`${outDir}/${slug}.txt`, text)
      console.log(`  -> ${text.length} chars, saved to ${slug}.txt`)
    } catch (e: any) {
      console.error(`  ERROR: ${e.message}`)
    }
  }
}

main()
