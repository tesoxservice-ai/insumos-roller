import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'
import CartDrawer from '@/components/ui/CartDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  )
}