import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'
import CartDrawer from '@/components/ui/CartDrawer'
import AnnouncementBar, { ANNOUNCEMENT_BAR_HEIGHT } from '@/components/ui/AnnouncementBar'
import PromoPopup from '@/components/ui/PromoPopup'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <CartDrawer />
      <PromoPopup />
      <main style={{ paddingTop: ANNOUNCEMENT_BAR_HEIGHT }}>{children}</main>
      <Footer />
    </>
  )
}