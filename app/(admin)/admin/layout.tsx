'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  {
    href: '/admin', label: 'Dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  },
  {
    href: '/admin/colores', label: 'Colores',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/><path d="M2 12h20"/></svg>
  },
  {
    href: '/admin/precios', label: 'Precios',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  },
  {
    href: '/admin/stock', label: 'Stock',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
  },
  {
    href: '/admin/faq', label: 'FAQ',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  },
]

const SIDEBAR_WIDTH = 220

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })
  }, [router])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (checking) {
    return (
      <div style={{ background: '#F8F9FF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: 14 }}>Verificando sesión…</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F8F9FF', minHeight: '100vh' }}>
      {/* Sidebar */}
      {!isMobile && (
        <aside style={{
          width: SIDEBAR_WIDTH, minHeight: '100vh',
          background: '#fff',
          borderRight: '1px solid #EAECF0',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #EAECF0', flexShrink: 0 }}>
            <Image
              src="/images/LOGO.png"
              alt="Insumos Roller"
              width={160}
              height={60}
              style={{ objectFit: 'contain', height: 44, width: 'auto' }}
            />
            <p style={{ color: '#999', fontSize: 11, margin: '6px 0 0 0', letterSpacing: '0.04em' }}>Panel de administración</p>
          </div>

          {/* Nav */}
          <nav style={{ padding: '12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_LINKS.map(link => {
              const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
              return (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 10, fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1500CC' : '#666',
                  background: isActive ? 'rgba(21,0,204,0.07)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}>
                  <span style={{ color: isActive ? '#1500CC' : '#999', display: 'flex' }}>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Cerrar sesión */}
          <div style={{ padding: '12px 12px 24px', borderTop: '1px solid #EAECF0', flexShrink: 0 }}>
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 14px', borderRadius: 10, fontSize: 14,
              color: '#999', background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#999'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      {/* Mobile header */}
      {isMobile && (
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#fff', borderBottom: '1px solid #EAECF0', padding: '0 16px', display: 'flex', alignItems: 'center', zIndex: 40 }}>
          <Image src="/images/LOGO.png" alt="Insumos Roller" width={120} height={40} style={{ objectFit: 'contain', height: 32, width: 'auto' }} />
        </header>
      )}

      {/* Contenido */}
      <div style={{ marginLeft: isMobile ? 0 : SIDEBAR_WIDTH, paddingTop: isMobile ? 56 : 0, minHeight: '100vh' }}>
        <div style={{ padding: isMobile ? 16 : 32 }}>
          {children}
        </div>
      </div>
    </div>
  )
}