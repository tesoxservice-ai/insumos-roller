'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PagoExitoso() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 6000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '60px 48px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 60px rgba(0,0,0,0.08)',
      }}>
        {/* Ícono */}
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(13,122,78,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0D7A4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 900, color: '#0A0A14',
          letterSpacing: '0.06em', margin: '0 0 12px',
          textTransform: 'uppercase',
        }}>
          ¡Pago confirmado!
        </h1>

        <p style={{ fontSize: 15, color: '#888', margin: '0 0 32px', lineHeight: 1.6 }}>
          Tu pedido fue procesado correctamente. En breve nos ponemos en contacto para coordinar la instalación.
        </p>

        <div style={{
          background: 'rgba(13,122,78,0.05)',
          border: '1px solid rgba(13,122,78,0.15)',
          borderRadius: 10, padding: '14px 20px',
          marginBottom: 32,
        }}>
          <p style={{ fontSize: 13, color: '#0D7A4E', margin: 0, fontWeight: 600 }}>
            Te enviamos la confirmación por email
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            background: '#14008C',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '16px 24px',
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Volver al inicio
        </button>

        <p style={{ fontSize: 12, color: '#CCC', margin: '16px 0 0' }}>
          Serás redirigido automáticamente en unos segundos...
        </p>
      </div>
    </div>
  )
}
