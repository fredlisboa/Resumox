import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'NutriChá - Receita Personalizada Para Seu Corpo',
  description: 'Descubra a receita personalizada do NutriChá com cravo, açafrão e orégano que vai desinflamar, desinchar e te ajudar a emagrecer de forma natural.',
  manifest: '/nutricha/manifest.json',
  icons: {
    icon: [
      { url: '/nutricha/icon.svg?v=1', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/nutricha/apple-icon.svg?v=1', type: 'image/svg+xml' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriChá'
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'NutriChá',
    'chá emagrecedor',
    'chá natural para emagrecer',
    'perder peso naturalmente',
    'chá desinflamante',
    'receita de chá para emagrecer',
    'NutriChá receita personalizada',
    'emagrecer com chá'
  ],
  authors: [{ name: 'NutriChá' }],
  creator: 'NutriChá',
  publisher: 'NutriChá',
  robots: 'index, follow',
  openGraph: {
    title: 'NutriChá - Receita Personalizada Para Seu Corpo',
    description: 'Nutricionista revela: NutriChá com cravo, açafrão e orégano que ajuda a emagrecer de forma natural. Acesse sua receita personalizada.',
    siteName: 'NutriChá',
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriChá - Receita Personalizada Para Seu Corpo',
    description: 'Nutricionista revela: NutriChá com cravo, açafrão e orégano que ajuda a emagrecer de forma natural. Acesse sua receita personalizada.'
  }
}

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function NutrichaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
