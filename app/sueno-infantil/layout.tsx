import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Plan de Sueño Infantil - Guía Personalizada para tu Bebé',
  description: 'Descubre el plan personalizado con acciones prácticas que realmente funcionan para establecer rutinas de sueño saludables para tu bebé.',
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
    title: 'Sueño Infantil'
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'sueño infantil',
    'rutina de sueño bebé',
    'cómo hacer dormir al bebé',
    'plan de sueño',
    'descanso infantil',
    'bebé dormir',
    'noches tranquilas',
    'guía del sueño'
  ],
  authors: [{ name: 'Plan Sueño Infantil' }],
  creator: 'Plan Sueño Infantil',
  publisher: 'Plan Sueño Infantil',
  robots: 'index, follow',
  openGraph: {
    title: 'Plan de Sueño Infantil - Guía Personalizada para tu Bebé',
    description: 'Descubre el plan personalizado con acciones prácticas que realmente funcionan para establecer rutinas de sueño saludables para tu bebé.',
    siteName: 'Plan Sueño Infantil',
    locale: 'es_LA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plan de Sueño Infantil - Guía Personalizada para tu Bebé',
    description: 'Descubre el plan personalizado con acciones prácticas que realmente funcionan para establecer rutinas de sueño saludables para tu bebé.'
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
