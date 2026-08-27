'use client'

import { useState } from 'react'
import type { ConfiguradorState, ReglaPrecio } from '@/types'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'

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

export default function StepCierre({
  state,
  precioEstimado,
  onAgregarAlPresupuesto,
  onNuevoProducto,
}: StepCierreProps) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ambiente, setAmbiente] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const [presupuestoOpen, setPresupuestoOpen] = useState(false)

  const handleWhatsApp = () => {
    if (precioEstimado === null) return
    const mensaje = generarMensajeWhatsApp(state, precioEstimado)
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
    const url = generarUrlWhatsApp(numero, mensaje)
    window.open(url, '_blank')
  }

  const handleConfirmarAmbiente = () => {
    if (!ambiente.trim()) return
    onAgregarAlPresupuesto(ambiente.trim())
    setConfirmado(true)
    setTimeout(() => {
      setModalAbierto(false)
      setAmbiente('')
      setConfirmado(false)
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
          Revisá los detalles antes de continuar.
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
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #EBEBEB',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800,
              color: '#14008C', letterSpacing: '0.12em',
            }}>
              CONFIGURACIÓN
            </span>
          </div>

          {/* Filas */}
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
                  <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>
                    {fila.icon}
                  </span>
                  <span style={{ fontSize: 13, color: '#888', flex: 1, minWidth: 80 }}>
                    {fila.label}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: '#0A0A14',
                    textAlign: 'right', whiteSpace: 'pre-line',
                  }}>
                    {valor}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Precio */}
          <div style={{
            padding: '16px 20px 20px',
            borderTop: '1px solid #EBEBEB',
            background: '#FAFAFA',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: '#888',
              letterSpacing: '0.12em', marginBottom: 6,
            }}>
              PRECIO ORIENTATIVO
            </div>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontWeight: 900, color: '#0A0A14',
              letterSpacing: '-0.03em', marginBottom: 6,
            }}>
              {precioEstimado !== null
                ? `$ ${precioEstimado.toLocaleString('es-AR')}`
                : '—'}
            </div>
            <p style={{ fontSize: 11, color: '#BBB', margin: 0, lineHeight: 1.5 }}>
              El precio es orientativo y puede variar según disponibilidad.
            </p>
          </div>
        </div>

        {/* Columna derecha — Imagen ilustrativa */}
        <div style={{
          background: '#F5F0E8',
          border: '1px solid #EBEBEB',
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Imagen cortina ilustrativa */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            minHeight: 280,
          }}>
            <svg viewBox="0 0 200 260" width="180" height="240" fill="none">
              {/* Marco ventana */}
              <rect x="20" y="20" width="160" height="200" rx="4" fill="#E8E0D4" stroke="#C8C0B0" strokeWidth="3"/>
              {/* Cortina con color del estado */}
              <rect x="22" y="20" width="156" height="140" rx="2"
                fill={state.color?.hex ?? '#E0D8CC'}
                opacity="0.95"
              />
              {/* Líneas de tela */}
              {[40, 60, 80, 100, 120, 140].map(y => (
                <line key={y} x1="22" y1={y} x2="178" y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
              ))}
              {/* Tubo superior */}
              <rect x="14" y="12" width="172" height="14" rx="7" fill="#B0A898"/>
              {/* Barra inferior */}
              <rect x="20" y="158" width="160" height="8" rx="3" fill="#C8C0B0"/>
              {/* Vista exterior */}
              <rect x="24" y="168" width="152" height="48" rx="2" fill="#A8C8A8" opacity="0.4"/>
              <rect x="24" y="168" width="74" height="48" fill="rgba(255,255,255,0.15)"/>
              {/* Cadena */}
              <line x1="168" y1="26" x2="168" y2="158" stroke="#B0A898" strokeWidth="1.5"/>
              {[34, 42, 50, 58, 66].map(y => (
                <circle key={y} cx="168" cy={y} r="2" fill="#B0A898"/>
              ))}
            </svg>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: '12px 16px',
            background: '#fff',
            borderTop: '1px solid #EBEBEB',
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ fontSize: 11, color: '#999', margin: 0, lineHeight: 1.5 }}>
              La imagen es solo ilustrativa.<br/>
              Los colores pueden variar levemente según la pantalla.
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#1B5E3B',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar por WhatsApp
          </div>
          <span style={{ fontSize: 18 }}>›</span>
        </button>

        {/* Agregar al presupuesto */}
        <button
          onClick={() => setModalAbierto(true)}
          style={{
            width: '100%',
            padding: '15px 24px',
            background: '#fff',
            border: '1.5px solid #EBEBEB',
            borderRadius: 6,
            color: '#0A0A14',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#14008C'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#EBEBEB'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>＋</span>
            Agregar al presupuesto
          </div>
          <span style={{ fontSize: 18, color: '#BBB' }}>›</span>
        </button>

        {/* Configurar otra cortina */}
        <button
          onClick={onNuevoProducto}
          style={{
            width: '100%',
            padding: '12px',
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#14008C'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <span>↺</span> Configurar otra cortina
        </button>
      </div>

      {/* Modal ambiente */}
      {modalAbierto && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)', padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 8,
            padding: 32, maxWidth: 400, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {confirmado ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0D7A4E', margin: 0 }}>
                  ¡Ambiente agregado!
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 6px 0' }}>
                  ¿Cómo se llama el ambiente?
                </h3>
                <p style={{ fontSize: 13, color: '#999', margin: '0 0 20px 0' }}>
                  Ej: Dormitorio principal, Living, Cocina
                </p>
                <input
                  type="text"
                  value={ambiente}
                  onChange={e => setAmbiente(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleConfirmarAmbiente()}
                  placeholder="Nombre del ambiente"
                  autoFocus
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid #E0E0E0', borderRadius: 6,
                    fontSize: 14, outline: 'none', marginBottom: 16,
                    fontFamily: 'inherit', color: '#0A0A14',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                  onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setModalAbierto(false)}
                    style={{
                      flex: 1, padding: '11px',
                      background: '#fff', border: '1.5px solid #E0E0E0',
                      borderRadius: 6, fontSize: 13, cursor: 'pointer',
                      color: '#888', fontFamily: 'inherit',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarAmbiente}
                    disabled={!ambiente.trim()}
                    style={{
                      flex: 1, padding: '11px',
                      background: ambiente.trim() ? '#14008C' : '#EEE',
                      border: 'none', borderRadius: 6,
                      fontSize: 13, fontWeight: 700,
                      cursor: ambiente.trim() ? 'pointer' : 'not-allowed',
                      color: ambiente.trim() ? '#fff' : '#BBB',
                      fontFamily: 'inherit',
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .cierre-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}