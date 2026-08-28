'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const LINKS = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Nosotros', href: '/faq#nosotros' },
  { label: 'Inspiración', href: '/#inspiracion' },
  { label: 'Guías', href: '/#guias' },
  { label: 'Contacto', href: 'https://wa.me/541133802658?text=Hola%2C%20quiero%20hacer%20una%20consulta', external: true },
]

// Solo en el home el nav arranca transparente
const RUTAS_TRANSPARENTES = ['/']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { count, abrirDrawer } = useCart()
  const pathname = usePathname()

  const esHome = RUTAS_TRANSPARENTES.includes(pathname)
  const transparente = false

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkColor = transparente ? 'rgba(20,0,20,0.85)' : 'var(--text-mid)'
  const linkHoverColor = transparente ? '#14008C' : 'var(--primary)'
  const carritoColor = transparente ? 'rgba(20,0,20,0.85)' : 'var(--text-mid)'

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      backgroundColor: transparente ? 'transparent' : 'rgba(255,255,255,0.97)',
      backdropFilter: transparente ? 'none' : 'blur(12px)',
      borderBottom: transparente ? '1px solid transparent' : '1px solid var(--border)',
      boxShadow: transparente ? 'none' : '0 1px 12px rgba(20,0,140,0.06)',
      transition: 'all 0.3s',
    }}>
      <div style={{
        width: '100%',
        padding: '0 48px',
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/LOGO_transparente.png"
            alt="Insumos Roller"
            width={320}
            height={120}
            style={{ objectFit: 'contain', height: 80, width: 'auto', transition: 'opacity 0.3s' }}
            priority
          />
        </Link>

        {/* Links */}
        <div style={{
          display: 'flex', alignItems: 'center', flex: 1,
          justifyContent: 'center', gap: 'clamp(24px, 4vw, 64px)',
        }}>
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              style={{
                fontSize: 19, fontWeight: 600, letterSpacing: '0.03em',
                color: linkColor, textDecoration: 'none',
                transition: 'color 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Carrito */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={abrirDrawer}
            style={{
              position: 'relative', background: 'none', border: 'none',
              cursor: 'pointer', color: carritoColor,
              display: 'flex', alignItems: 'center',
              padding: 4, transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = carritoColor)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -6,
                background: '#14008C', color: '#fff',
                fontSize: 11, fontWeight: 800,
                borderRadius: '100px', minWidth: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px', lineHeight: 1,
              }}>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  )
}