import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local first (takes precedence)
config({ path: resolve(process.cwd(), '.env.local') })

// Load .env as fallback
config({ path: resolve(process.cwd(), '.env') })
