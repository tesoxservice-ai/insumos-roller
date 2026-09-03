'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useIsMobile } from '@/hooks/useIsMobile'

const LINKS = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Nosotros', href: '/faq#nosotros' },
  { label: 'Inspiración', href: '/#inspiracion' },
  { label: 'Guías', href: '/#guias' },
  { label: 'Contacto', href: 'https://wa.me/541133802658?text=Hola%2C%20quiero%20hacer%20una%20consulta', external: true },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, abrirDrawer } = useCart()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menuOpen])

  const linkColor = 'var(--text-mid)'
  const linkHover = 'var(--primary)'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(240,235,227,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 12px rgba(20,0,140,0.06)',
      }}>
        <div style={{
          width: '100%',
          padding: isMobile ? '0 20px' : '0 48px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/images/LOGO_transparente.png"
              alt="Insumos Roller"
              width={320} height={120}
              style={{ objectFit: 'contain', height: isMobile ? 40 : 52, width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop — links centrados */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 'clamp(24px, 4vw, 64px)' }}>
              {LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.03em', color: linkColor, textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.color = linkHover}
                  onMouseLeave={e => e.currentTarget.style.color = linkColor}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Derecha: carrito + hamburguesa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {/* Carrito */}
            <button onClick={abrirDrawer} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: linkColor, display: 'flex', alignItems: 'center', padding: 4 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -6, background: '#14008C', color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: '100px', minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {/* Hamburguesa — solo mobile */}
            {isMobile && (
              <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: 4, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center' }} aria-label="Menú">
                <span style={{ display: 'block', width: 22, height: 2, background: 'currentColor', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                <span style={{ display: 'block', width: 22, height: 2, background: 'currentColor', borderRadius: 2, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
                <span style={{ display: 'block', width: 22, height: 2, background: 'currentColor', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(240,235,227,0.98)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', paddingTop: 64 }} onClick={() => setMenuOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 28px', gap: 4 }} onClick={e => e.stopPropagation()}>
            {LINKS.map(link => (
              <Link key={link.href} href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid var(--border)', letterSpacing: '-0.01em', fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/configurador" onClick={() => setMenuOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#14008C', color: '#fff', padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
                Configurar mi cortina →
              </Link>
              <Link href="/stock" onClick={() => setMenuOpen(false)} style={{ display: 'block', textAlign: 'center', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
                Ver stock disponible
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}