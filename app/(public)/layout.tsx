import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
