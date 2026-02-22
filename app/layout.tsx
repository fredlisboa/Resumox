import type { Metadata, Viewport } from 'next'
import './globals.css'
import SecurityProvider from '@/components/SecurityProvider'

export const metadata: Metadata = {
  title: 'NeuroReset - Tu Proceso de Transformación',
  description: 'Accede a tus archivos de reprogramación mental y materiales exclusivos. Contenido original protegido por criptografía.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NeuroReset'
  },
  formatDetection: {
    telephone: false
  },
  keywords: ['NeuroReset', 'Reprogramación Mental', 'Transformación', 'Audio Terapéutico'],
  authors: [{ name: 'NeuroReset' }],
  creator: 'NeuroReset',
  publisher: 'NeuroReset',
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  themeColor: '#0a0e27',
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
    <html lang="es-419">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
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
