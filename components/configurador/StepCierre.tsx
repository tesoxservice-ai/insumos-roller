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

const FILAS = [
  { icon: '🪟', label: 'Tipo de cortina', key: 'tipo' },
  { icon: '🧵', label: 'Tela', key: 'tela' },
  { icon: '🎨', label: 'Color', key: 'color' },
  { icon: '📐', label: 'Medidas', key: 'medidas' },
  { icon: '⚙️', label: 'Sistema', key: 'sistema' },
  { icon: '🔧', label: 'Instalación', key: 'instalacion' },
  { icon: '📅', label: 'Plazo estimado', key: 'plazo' },
]

const MAX_ANCHO = 300
const MAX_ALTO = 300

export default function StepCierre({
  state,
  precioEstimado,
  onNuevoProducto,
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
    }, false) // false = no abrir el drawer

    setAgregadoAlCarrito(true)

    // Después de 1.5s vuelve al inicio del configurador
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
        return state.ancho && state.alto
          ? `Ancho: ${state.ancho} cm\nAlto: ${state.alto} cm`
          : '—'
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
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          fontWeight: 700, color: '#0A0A14',
          letterSpacing: '-0.02em', margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Resumen de tu cortina
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 14, color: '#999', margin: 0 }}>
          Revisá los detalles antes de agregar al carrito.
        </p>
      </div>

      {/* Layout dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 20,
      }}
        className="cierre-layout"
      >
        {/* Columna izquierda — Tabla */}
        <div style={{
          background: '#fff',
          border: '1px solid #EBEBEB',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #EBEBEB' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#14008C', letterSpacing: '0.12em' }}>
              CONFIGURACIÓN
            </span>
          </div>
          <div>
            {FILAS.map((fila, i) => {
              const valor = getValor(fila.key)
              const esMedidas = fila.key === 'medidas'
              return (
                <div
                  key={fila.key}
                  style={{
                    display: 'flex',
                    alignItems: esMedidas ? 'flex-start' : 'center',
                    gap: 12,
                    padding: '13px 20px',
                    borderBottom: i < FILAS.length - 1 ? '1px solid #F5F5F5' : 'none',
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>{fila.icon}</span>
                  <span style={{ fontSize: 13, color: '#888', flex: 1, minWidth: 80 }}>{fila.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A14', textAlign: 'right', whiteSpace: 'pre-line' }}>
                    {valor}
                  </span>
                </div>
              )
            })}
          </div>
          <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #EBEBEB', background: '#FAFAFA' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#888', letterSpacing: '0.12em', marginBottom: 6 }}>
              PRECIO ORIENTATIVO
            </div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, color: '#0A0A14', letterSpacing: '-0.03em', marginBottom: 6 }}>
              {precioEstimado !== null ? `$ ${precioEstimado.toLocaleString('es-AR')}` : '—'}
            </div>
            <p style={{ fontSize: 11, color: '#BBB', margin: 0, lineHeight: 1.5 }}>
              El precio es orientativo y puede variar según disponibilidad.
            </p>
          </div>
        </div>

        {/* Columna derecha — Imagen ilustrativa */}
        <div style={{
          background: '#F5F0E8', border: '1px solid #EBEBEB',
          borderRadius: 8, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 280 }}>
            <svg viewBox="0 0 200 260" width="180" height="240" fill="none">
              <rect x="20" y="20" width="160" height="200" rx="4" fill="#E8E0D4" stroke="#C8C0B0" strokeWidth="3"/>
              <rect x="22" y="20" width="156" height="140" rx="2" fill={state.color?.hex ?? '#E0D8CC'} opacity="0.95"/>
              {[40, 60, 80, 100, 120, 140].map(y => (
                <line key={y} x1="22" y1={y} x2="178" y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
              ))}
              <rect x="14" y="12" width="172" height="14" rx="7" fill="#B0A898"/>
              <rect x="20" y="158" width="160" height="8" rx="3" fill="#C8C0B0"/>
              <rect x="24" y="168" width="152" height="48" rx="2" fill="#A8C8A8" opacity="0.4"/>
              <rect x="24" y="168" width="74" height="48" fill="rgba(255,255,255,0.15)"/>
              <line x1="168" y1="26" x2="168" y2="158" stroke="#B0A898" strokeWidth="1.5"/>
              {[34, 42, 50, 58, 66].map(y => (
                <circle key={y} cx="168" cy={y} r="2" fill="#B0A898"/>
              ))}
            </svg>
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #EBEBEB', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ fontSize: 11, color: '#999', margin: 0, lineHeight: 1.5 }}>
              La imagen es solo ilustrativa.<br/>
              Los colores pueden variar levemente según la pantalla.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso medida especial */}
      {medidaEspecial && (
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8, padding: '14px 18px', marginBottom: 12,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
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
            width: '100%', padding: '16px 24px',
            background: agregadoAlCarrito ? '#0D7A4E' : '#14008C',
            border: 'none', borderRadius: 6, color: '#fff',
            fontSize: 15, fontWeight: 700,
            cursor: !agregadoAlCarrito ? 'pointer' : 'not-allowed',
            opacity: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'inherit', transition: 'background 0.2s, opacity 0.15s',
          }}
          onMouseEnter={e => { if (!agregadoAlCarrito) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {agregadoAlCarrito ? '✓ Agregado — volviendo al inicio...' : 'Agregar al carrito'}
          </div>
          <span style={{ fontSize: 18 }}>›</span>
        </button>

        <button
          onClick={onNuevoProducto}
          style={{
            width: '100%', padding: '12px', background: 'none', border: 'none',
            color: '#888', fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontFamily: 'inherit', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#14008C'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <span>↺</span> Configurar otra cortina
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