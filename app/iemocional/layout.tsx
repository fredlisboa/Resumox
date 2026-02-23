import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Super Kit Inteligência Emocional | Crie Crianças Felizes e Resilientes',
  description: 'O Kit de Ferramentas Definitivo com 13 recursos baseados em neurociência para criar crianças felizes, corajosas e que entendem o que sentem. Transforme birras em conexão.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-iemocional-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-iemocional-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon-iemocional.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kit Inteligência Emocional'
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'inteligência emocional para crianças',
    'educação emocional infantil',
    'ferramentas inteligência emocional',
    'jogos de emoções para crianças',
    'manejo de birras',
    'controle de impulsos infantil',
    'desenvolvimento socioemocional',
    'criação respeitosa',
    'neurociência para pais',
    'atividades para regular emoções',
    'autoestima infantil',
    'resiliência em crianças'
  ],
  authors: [{ name: 'Iemocional', url: 'https://iemocional.1sd.online' }],
  creator: 'Iemocional',
  publisher: 'Iemocional',
  robots: 'index, follow',
  openGraph: {
    title: 'Super Kit Inteligência Emocional | O Presente que Durará a Vida Toda',
    description: 'O kit definitivo com 13 recursos baseados em neurociência para criar crianças felizes, resilientes e emocionalmente saudáveis.',
    url: 'https://iemocional.1sd.online',
    siteName: 'Kit Inteligência Emocional',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://iemocional.1sd.online/images/banner/banner-hero-lp.png',
        width: 1200,
        height: 630,
        alt: 'Kit completo de ferramentas de inteligência emocional para crianças'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transforme Birras em Conexão | Super Kit Inteligência Emocional',
    description: '13 ferramentas práticas baseadas em neurociência para pais. Ajude seu filho a desenvolver autoestima, resiliência e autocontrole de forma divertida.',
    images: ['https://iemocional.1sd.online/images/banner/banner-hero-lp.png']
  }
}

export const viewport: Viewport = {
  themeColor: '#73BE48', // Lime green from design system
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function IEmocionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
