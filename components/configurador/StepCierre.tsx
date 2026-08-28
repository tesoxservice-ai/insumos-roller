'use client'

import { useState } from 'react'
import type { ConfiguradorState, ReglaPrecio } from '@/types'
import { useCart } from '@/context/CartContext'

interface StepCierreProps {
  state: ConfiguradorState
  precioEstimado: number | null
  reglas: ReglaPrecio[]
  onAgregarAlPresupuesto: (ambiente: string) => void
  onNuevoProducto: () => void
}

const MAX_ANCHO = 300
const MAX_ALTO = 300

const FILAS = [
  {
    label: 'Tipo de cortina', key: 'tipo',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  },
  {
    label: 'Tela', key: 'tela',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  },
  {
    label: 'Color', key: 'color',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
  },
  {
    label: 'Medidas', key: 'medidas',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7h18M3 17h18"/><path d="M7 3v18M17 3v18"/></svg>
  },
  {
    label: 'Sistema', key: 'sistema',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
  },
  {
    label: 'Instalación', key: 'instalacion',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
  },
  {
    label: 'Plazo estimado', key: 'plazo',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  },
]

export default function StepCierre({
  state, precioEstimado, onNuevoProducto,
}: StepCierreProps) {
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false)
  const { agregarItem } = useCart()

  const medidaEspecial = state.ancho > MAX_ANCHO || state.alto > MAX_ALTO

  const handleAgregarAlCarrito = () => {
    const descripcion = [
      state.tela?.nombre ?? '',
      state.color?.nombre ?? '',
      state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : '',
      state.sistema ? `Sistema: ${state.sistema}` : '',
      state.instalacion ? 'Con instalación' : '',
    ].filter(Boolean).join(' · ')

    agregarItem({
      id: `medida-${Date.now()}`,
      nombre: `Cortina ${state.tipo?.nombre ?? 'a medida'}`,
      descripcion,
      precio: precioEstimado,
      tipo: 'medida',
      medidaEspecial,
    }, false)

    setAgregadoAlCarrito(true)
    setTimeout(() => {
      onNuevoProducto()
      setAgregadoAlCarrito(false)
    }, 1500)
  }

  function getValor(key: string): string {
    switch (key) {
      case 'tipo': return state.tipo?.nombre ?? '—'
      case 'tela': return state.tela?.nombre ?? '—'
      case 'color': return state.color?.nombre ?? '—'
      case 'medidas':
        return state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : '—'
      case 'sistema':
        if (state.sistema === 'motorizado' || state.sistema === 'Motorizada')
          return `Motorizado (+$${state.sistemaExtra.toLocaleString('es-AR')})`
        if (state.sistema === 'manual' || state.sistema === 'Cadena')
          return 'Cadena manual'
        return '—'
      case 'instalacion':
        return state.instalacion
          ? `Instalación profesional (+$${state.instExtra.toLocaleString('es-AR')})`
          : 'La instalo yo'
      case 'plazo': return '15 días hábiles'
      default: return '—'
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 300,
          color: '#0A0A14',
          letterSpacing: '-0.01em',
          margin: '0 0 14px 0',
          fontStyle: 'italic',
          fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
          lineHeight: 1.1,
        }}>
          Resumen de tu cortina
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, color: '#AAA', margin: 0, fontFamily: 'var(--font-cormorant), serif' }}>
          Revisá los detalles antes de agregar al carrito.
        </p>
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="cierre-layout">

        {/* Tabla */}
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#14008C', letterSpacing: '0.16em' }}>CONFIGURACIÓN</span>
          </div>

          {FILAS.map((fila, i) => {
            const valor = getValor(fila.key)
            return (
              <div key={fila.key} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '15px 24px',
                borderBottom: i < FILAS.length - 1 ? '1px solid #F5F5F5' : 'none',
              }}>
                <span style={{ color: '#BBBBCC', flexShrink: 0, display: 'flex' }}>{fila.icon}</span>
                <span style={{ fontSize: 14, color: '#888', flex: 1 }}>{fila.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A14', textAlign: 'right' }}>{valor}</span>
              </div>
            )
          })}

          {/* Precio */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid #EBEBEB', background: '#FAFAFA' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#BBB', letterSpacing: '0.14em', marginBottom: 8 }}>
              PRECIO ORIENTATIVO
            </div>
            <div style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 900, color: '#0A0A14',
              letterSpacing: '-0.04em', marginBottom: 6,
              fontFamily: 'var(--font-cormorant), serif',
            }}>
              {precioEstimado !== null ? `$\u00A0${precioEstimado.toLocaleString('es-AR')}` : '—'}
            </div>
            <p style={{ fontSize: 12, color: '#CCC', margin: 0, lineHeight: 1.5 }}>
              El precio es orientativo y puede variar según disponibilidad.
            </p>
          </div>
        </div>

        {/* Imagen ilustrativa */}
        <div style={{
          background: '#F5F0E8', border: '1px solid #EBEBEB',
          borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 280 }}>
            <svg viewBox="0 0 200 260" width="160" height="220" fill="none">
              <rect x="20" y="20" width="160" height="200" rx="4" fill="#E8E0D4" stroke="#C8C0B0" strokeWidth="2"/>
              <rect x="22" y="20" width="156" height="140" rx="2" fill={state.color?.hex ?? '#E0D8CC'} opacity="0.95"/>
              {[40,60,80,100,120,140].map(y => (
                <line key={y} x1="22" y1={y} x2="178" y2={y} stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
              ))}
              <rect x="14" y="12" width="172" height="14" rx="7" fill="#B0A898"/>
              <rect x="20" y="158" width="160" height="8" rx="3" fill="#C8C0B0"/>
              <rect x="24" y="168" width="152" height="48" rx="2" fill="#A8C8A8" opacity="0.4"/>
              <line x1="168" y1="26" x2="168" y2="158" stroke="#B0A898" strokeWidth="1.5"/>
              {[34,42,50,58,66].map(y => <circle key={y} cx="168" cy={y} r="2" fill="#B0A898"/>)}
            </svg>
          </div>
          <div style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid #EBEBEB', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={{ fontSize: 12, color: '#BBB', margin: 0, lineHeight: 1.5 }}>
              Imagen ilustrativa. Los colores pueden variar levemente según la pantalla.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso medida especial */}
      {medidaEspecial && (
        <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p style={{ fontSize: 14, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
            Esta cortina tiene medidas especiales. Nuestro equipo te va a confirmar el precio final al recibir tu pedido por WhatsApp.
          </p>
        </div>
      )}

      {/* Botones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={handleAgregarAlCarrito}
          disabled={agregadoAlCarrito}
          style={{
            width: '100%', padding: '18px 28px',
            background: agregadoAlCarrito ? '#0D7A4E' : '#14008C',
            border: 'none', borderRadius: 12, color: '#fff',
            fontSize: 16, fontWeight: 700,
            cursor: !agregadoAlCarrito ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'inherit', transition: 'background 0.2s, opacity 0.15s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => { if (!agregadoAlCarrito) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {agregadoAlCarrito ? '✓ Agregado — volviendo al inicio...' : 'Agregar al carrito'}
          </div>
          <span style={{ fontSize: 20 }}>→</span>
        </button>

        <button
          onClick={onNuevoProducto}
          style={{
            width: '100%', padding: '14px', background: 'none', border: 'none',
            color: '#BBB', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontFamily: 'inherit', transition: 'color 0.15s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#14008C'}
          onMouseLeave={e => e.currentTarget.style.color = '#BBB'}
        >
          ↺ Configurar otra cortina
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .cierre-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
} 