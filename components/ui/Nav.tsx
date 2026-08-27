'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Inspiración', href: '/#inspiracion' },
  { label: 'Guías', href: '/#guias' },
  { label: 'Contacto', href: '/#contacto' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 12px rgba(20,0,140,0.06)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div style={{
        width: '100%',
        padding: '0 48px',
        height: 76,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo — izquierda */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1, flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            INSUM<span style={{ color: 'var(--primary)' }}>O</span>S
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', color: 'var(--primary)' }}>
            R<span style={{ color: 'var(--text)' }}>O</span>LLER
          </span>
        </Link>

        {/* Links — centro */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          gap: 'clamp(20px, 4vw, 64px)',
        }}>
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--text-mid)', textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mid)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + carrito — derecha */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Carrito */}
          <Link
            href="/stock"
            style={{ position: 'relative', color: 'var(--text-mid)', textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mid)')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </Link>

          {/* Cotizá ahora */}
          <Link
            href="/configurador"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              borderRadius: '100px',
              padding: '11px 28px',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Cotizá ahora
          </Link>
        </div>

      </div>
    </nav>
  )
}