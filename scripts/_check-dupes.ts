import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const { data, error } = await supabase
    .from('resumox_books')
    .select('slug, title, original_title')
    .order('created_at', { ascending: false })
  if (error) { console.error('Error:', error.message); return }
  console.log('Total books in DB:', data.length)
  const titles = data.map(b => (b.original_title || b.title).toLowerCase())
  console.log('All original_titles:', JSON.stringify(titles, null, 2))
}
main()
