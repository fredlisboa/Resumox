import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Super Kit Inteligencia Emocional | Cría Niños Felices y Resilientes',
  description: 'El Kit de Herramientas Definitivo con 13 recursos basados en neurociencia para criar niños felices, valientes y que entienden lo que sienten. Transforma berrinches en conexión.',
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
    title: 'Kit Inteligencia Emocional'
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'inteligencia emocional para niños',
    'educación emocional infantil',
    'herramientas inteligencia emocional',
    'juegos de emociones para niños',
    'manejo de berrinches',
    'control de impulsos infantil',
    'desarrollo socioemocional',
    'crianza respetuosa',
    'neurociencia para padres',
    'actividades para regular emociones',
    'autoestima infantil',
    'resiliencia en niños'
  ],
  authors: [{ name: 'Iemocional', url: 'https://iemocional.1sd.online' }],
  creator: 'Iemocional',
  publisher: 'Iemocional',
  robots: 'index, follow',
  openGraph: {
    title: 'Super Kit Inteligencia Emocional | El Regalo que Durará Toda la Vida',
    description: 'El kit definitivo con 13 recursos basados en neurociencia para criar niños felices, resilientes y emocionalmente sanos.',
    url: 'https://iemocional.1sd.online',
    siteName: 'Kit Inteligencia Emocional',
    locale: 'es_LA',
    type: 'website',
    images: [
      {
        url: 'https://iemocional.1sd.online/images/banner/banner-hero-lp.png',
        width: 1200,
        height: 630,
        alt: 'Kit completo de herramientas de inteligencia emocional para niños'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transforma Berrinches en Conexión | Super Kit Inteligencia Emocional',
    description: '13 herramientas prácticas basadas en neurociencia para padres. Ayuda a tu hijo a desarrollar autoestima, resiliencia y autocontrol de forma divertida.',
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
