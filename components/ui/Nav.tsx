'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Inspiración', href: '/#inspiracion' },
  { label: 'Guías', href: '/#guias' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? 'rgba(15,14,12,0.85)'
          : 'rgba(15,14,12,0.6)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Max
          </span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--gold)' }}
          >
            Roller
          </span>
        </Link>

        {/* Links centro — solo desktop */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors hover:opacity-100"
              style={{ color: 'var(--text-mid)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/configurador"
          className="text-sm font-semibold px-5 py-2 transition-opacity hover:opacity-85"
          style={{
            backgroundColor: 'var(--gold)',
            color: '#0F0E0C',
            borderRadius: '100px',
          }}
        >
          Cotizá ahora
        </Link>
      </div>
    </nav>
  )
}
