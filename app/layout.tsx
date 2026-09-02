import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
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
    <html lang="es" className={cormorant.variable}>
      <body className={cormorant.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}