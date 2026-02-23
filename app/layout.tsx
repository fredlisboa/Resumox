import type { Metadata, Viewport } from 'next'
import './globals.css'
import SecurityProvider from '@/components/SecurityProvider'

export const metadata: Metadata = {
  title: 'Resumox — Resumos de Livros que Transformam',
  description: '659 resumos de livros com áudio, mapa mental, insights e exercícios práticos. Pagamento único. Zero mensalidade.',
  manifest: '/resumox/manifest.json',
  icons: {
    icon: [
      { url: '/resumox/icon.svg', type: 'image/svg+xml' },
      { url: '/resumox/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/resumox/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/resumox/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Resumox'
  },
  formatDetection: {
    telephone: false
  },
  keywords: ['Resumox', 'resumos de livros', 'desenvolvimento pessoal', 'livros de negócios'],
  authors: [{ name: 'Resumox' }],
  creator: 'Resumox',
  publisher: 'Resumox',
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Resumox" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="apple-touch-icon" href="/resumox/apple-touch-icon.png" />
        {/* Preconnect to Cloudflare Turnstile for better performance */}
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />
      </head>
      <body className="min-h-screen antialiased text-white">
        <SecurityProvider>
          {children}
        </SecurityProvider>
      </body>
    </html>
  )
}
