import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Plano de Sono Infantil - Guia Personalizado para seu Bebê',
  description: 'Descubra o plano personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.',
  manifest: '/sono-infantil/manifest.json',
  icons: {
    icon: [
      { url: '/sono-infantil/icon.svg?v=3', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/sono-infantil/apple-icon.svg?v=3', type: 'image/svg+xml' }
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
    'plano de sono',
    'descanso infantil',
    'bebê dormir',
    'noites tranquilas',
    'guia do sono'
  ],
  authors: [{ name: 'Plano Sono Infantil' }],
  creator: 'Plano Sono Infantil',
  publisher: 'Plano Sono Infantil',
  robots: 'index, follow',
  openGraph: {
    title: 'Plano de Sono Infantil - Guia Personalizado para seu Bebê',
    description: 'Descubra o plano personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.',
    siteName: 'Plano Sono Infantil',
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plano de Sono Infantil - Guia Personalizado para seu Bebê',
    description: 'Descubra o plano personalizado com ações práticas que realmente funcionam para estabelecer rotinas de sono saudáveis para seu bebê.'
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

export default function SonoInfantilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
