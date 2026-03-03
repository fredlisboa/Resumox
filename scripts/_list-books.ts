import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { data, error } = await supabase
    .from('resumox_books')
    .select('slug, original_title')
    .order('title')
  if (error) { console.error(error); return }
  for (const r of data!) {
    console.log(`${r.slug} | ${r.original_title || ''}`)
  }
}
main()
