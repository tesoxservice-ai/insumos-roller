'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/productos', label: 'Telas', icon: '🧵' },
  { href: '/admin/colores', label: 'Colores', icon: '🎨' },
  { href: '/admin/precios', label: 'Precios', icon: '💰' },
  { href: '/admin/stock', label: 'Stock', icon: '📦' },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: '📋' },
]

const SIDEBAR_WIDTH = 240

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login')
      } else {
        setChecking(false)
      }
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
      <div style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Verificando sesión…</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── SIDEBAR — solo desktop ── */}
      {!isMobile && (
        <aside style={{
          width: SIDEBAR_WIDTH,
          minHeight: '100vh',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Logo */}
          <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <span style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>
              Max<span style={{ color: 'var(--gold)' }}>Roller</span>
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>Panel de administración</p>
          </div>

          {/* Nav */}
          <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_LINKS.map(link => {
              const isActive =
                link.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--gold)' : 'var(--text-mid)',
                    background: isActive ? 'var(--gold-soft)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Cerrar sesión */}
          <div style={{ padding: '12px 12px 24px', flexShrink: 0 }}>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                color: 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      {/* ── HEADER MOBILE ── */}
      {isMobile && (
        <header style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 56,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 40,
        }}>
          <span style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>
            Max<span style={{ color: 'var(--gold)' }}>Roller</span>
          </span>
        </header>
      )}

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div style={{
        marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
        paddingTop: isMobile ? 56 : 0,
        minHeight: '100vh',
      }}>
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </div>

    </div>
  )
}