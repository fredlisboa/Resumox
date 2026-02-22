import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Resumox — Resumos de Livros que Transformam',
  description: '659 resumos de livros com áudio, mapa mental, insights e exercícios práticos. Pagamento único. Zero mensalidade.',
  keywords: ['resumos de livros', 'livros de negócios', 'desenvolvimento pessoal', 'finanças', 'produtividade'],
  icons: {
    icon: '/resumox/icon.svg',
    apple: '/resumox/icon.svg',
  },
  manifest: '/resumox/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function ResumoxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.variable} ${playfair.variable} resumox-theme`}>
      {children}
    </div>
  )
}
