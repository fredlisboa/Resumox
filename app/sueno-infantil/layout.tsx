import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Kit Sono Infantil - Guia Personalizado para seu Bebê',
  description: 'Descubra o guia personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.',
  manifest: '/sueno-infantil/manifest.json',
  icons: {
    icon: [
      { url: '/sueno-infantil/icon.svg?v=2', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/sueno-infantil/apple-icon.svg?v=2', type: 'image/svg+xml' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sono Infantil'
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'sono infantil',
    'rotina de sono bebê',
    'como fazer o bebê dormir',
    'guia do sono',
    'descanso infantil',
    'bebê dormir',
    'noites tranquilas',
    'guia do sono'
  ],
  authors: [{ name: 'Kit Sono Infantil' }],
  creator: 'Kit Sono Infantil',
  publisher: 'Kit Sono Infantil',
  robots: 'index, follow',
  openGraph: {
    title: 'Kit Sono Infantil - Guia Personalizado para seu Bebê',
    description: 'Descubra o guia personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.',
    siteName: 'Kit Sono Infantil',
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kit Sono Infantil - Guia Personalizado para seu Bebê',
    description: 'Descubra o guia personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.'
  }
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function SuenoInfantilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
