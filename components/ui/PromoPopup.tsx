'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/useIsMobile'

const STORAGE_KEY = 'promo-30-visto'
const DELAY_MS = 2000

export default function PromoPopup() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const enPago = pathname.startsWith('/stock/pago')

  useEffect(() => {
    if (enPago) return
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [enPago])

  const cerrar = () => {
    setVisible(false)
    try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  if (!visible || enPago) return null

  const serif = 'var(--font-cormorant), Cormorant Garamond, serif'

  return (
    <div
      onClick={cerrar}
      className="promo-fondo"
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(20,10,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Promoción 30% de descuento"
        onClick={e => e.stopPropagation()}
        className="promo-tarjeta"
        style={{ position: 'relative', display: 'flex', width: '100%', maxWidth: 640, background: 'var(--surface)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}
      >
        {!isMobile && (
          <div style={{ position: 'relative', width: '42%', minHeight: 360 }}>
            <Image src="/images/LIVING.png" alt="" fill style={{ objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1, padding: isMobile ? '36px 24px 24px' : '40px 32px 28px', textAlign: 'center', fontFamily: serif }}>
          <button
            onClick={cerrar}
            aria-label="Cerrar"
            style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 26, lineHeight: 1, cursor: 'pointer', color: 'var(--text-mid)' }}
          >
            ×
          </button>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: '#14008C' }}>PARA VOS</div>
          <div style={{ fontSize: isMobile ? 56 : 68, fontWeight: 600, lineHeight: 1, color: 'var(--text)', margin: '8px 0 6px' }}>30% OFF</div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text)' }}>EN TODA LA PÁGINA</div>
          <div style={{ fontSize: 15, letterSpacing: '0.08em', color: 'var(--text-mid)', margin: '14px 0 22px', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            O 3 Y 6 CUOTAS SIN INTERÉS
          </div>
          <Link
            href="/configurador"
            onClick={cerrar}
            style={{ display: 'block', background: '#14008C', color: '#F0EBE3', padding: '13px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700, letterSpacing: '0.16em', textDecoration: 'none' }}
          >
            ARMÁ TU CORTINA →
          </Link>
          <button
            onClick={cerrar}
            style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: serif, fontSize: 14, letterSpacing: '0.1em', color: 'var(--text-muted)' }}
          >
            Ahora no
          </button>
        </div>
      </div>
      <style>{`
        .promo-fondo { animation: promo-fondo-in 0.6s ease-out both; }
        .promo-tarjeta { animation: promo-tarjeta-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes promo-fondo-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes promo-tarjeta-in { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .promo-fondo, .promo-tarjeta { animation: none; }
        }
      `}</style>
    </div>
  )
}
