'use client'

import { useRouter } from 'next/navigation'

export default function PagoError() {
  const router = useRouter()

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
          background: 'rgba(229,62,62,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 900, color: '#0A0A14',
          letterSpacing: '0.06em', margin: '0 0 12px',
          textTransform: 'uppercase',
        }}>
          Error en el pago
        </h1>

        <p style={{ fontSize: 15, color: '#888', margin: '0 0 32px', lineHeight: 1.6 }}>
          No pudimos procesar tu pago. Podés intentarlo de nuevo o contactarnos por WhatsApp para coordinar otra forma de pago.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => router.back()}
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
            Intentar de nuevo
          </button>

          <a
            href={`https://wa.me/541133802658?text=${encodeURIComponent('¡Hola! Tuve un problema al pagar y quiero coordinar otra forma de pago.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10,
              background: '#fff',
              color: '#1B5E3B',
              border: '1.5px solid #1B5E3B',
              borderRadius: 12,
              padding: '14px 24px',
              fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
              transition: 'background 0.15s, color 0.15s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1B5E3B'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#1B5E3B'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
