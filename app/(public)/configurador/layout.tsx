import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export default function ConfiguradorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cormorant.className} style={{ fontFamily: 'inherit' }}>
      {children}
    </div>
  )
}