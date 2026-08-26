import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MaxRoller – Cortinas Roller a Medida',
    template: '%s | MaxRoller',
  },
  description:
    'Configurá tu cortina roller a medida. Amplio catálogo de telas, colores y sistemas. Instalación profesional en toda la zona.',
  keywords: ['cortinas roller', 'cortinas a medida', 'MaxRoller'],
  openGraph: {
    title: 'MaxRoller – Cortinas Roller a Medida',
    description: 'Configurá tu cortina roller a medida con nuestro configurador interactivo.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}