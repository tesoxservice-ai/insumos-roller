'use client'

import { useState, useEffect } from 'react'
import type { Tela, ReglaPrecio, ConfiguradorState } from '@/types'
import { calcularPrecio } from '@/lib/precio'

interface StepMedidasProps {
  ancho: number
  alto: number
  reglas: ReglaPrecio[]
  telaSeleccionada: Tela | null
  onChange: (ancho: number, alto: number) => void
  onFueraDeRango: () => void
}

export default function StepMedidas({
  ancho,
  alto,
  reglas,
  telaSeleccionada,
  onChange,
  onFueraDeRango,
}: StepMedidasProps) {
  const [anchoLocal, setAnchoLocal] = useState(ancho > 0 ? String(ancho) : '')
  const [altoLocal, setAltoLocal] = useState(alto > 0 ? String(alto) : '')
  const [anchoFocus, setAnchoFocus] = useState(false)
  const [altoFocus, setAltoFocus] = useState(false)

  const regla = telaSeleccionada
    ? reglas.find(r => r.tela_id === telaSeleccionada.id) ?? null
    : null

  const anchoNum = Number(anchoLocal)
  const altoNum = Number(altoLocal)
  const ambosIngresados = anchoNum > 0 && altoNum > 0

  const fueraDeRango = regla && ambosIngresados && (
    anchoNum < regla.minimo_ancho ||
    anchoNum > regla.maximo_ancho ||
    altoNum < regla.minimo_alto ||
    altoNum > regla.maximo_alto
  )

  const estadoDummy: ConfiguradorState = {
    tipo: null,
    tela: telaSeleccionada,
    color: null,
    colorHex: '',
    ancho: anchoNum,
    alto: altoNum,
    sistema: '',
    sistemaExtra: 0,
    instalacion: false,
    instExtra: 0,
  }

  const precioBase = ambosIngresados && !fueraDeRango
    ? calcularPrecio(estadoDummy, reglas)
    : null

  useEffect(() => {
    if (ambosIngresados) onChange(anchoNum, altoNum)
  }, [anchoNum, altoNum, onChange, ambosIngresados])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#14008C',
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          PASO 3 DE 6
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700, color: '#0A0A14',
          letterSpacing: '-0.02em', margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Ingresá las medidas
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Medí el ancho y el alto del hueco donde va la cortina, de soporte a soporte.
        </p>
      </div>

      {/* Layout dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        alignItems: 'start',
      }}
        className="medidas-layout"
      >
        {/* Columna izquierda — Campos */}
        <div style={{
          background: '#fff',
          border: '1px solid #EBEBEB',
          borderRadius: 8,
          padding: '28px 28px 24px',
        }}>
          {/* Ancho */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 12, fontWeight: 800,
              color: '#0A0A14', letterSpacing: '0.08em',
              marginBottom: 8,
            }}>
              ANCHO (cm)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={regla?.minimo_ancho ?? 30}
                max={regla?.maximo_ancho ?? 400}
                value={anchoLocal}
                onChange={e => setAnchoLocal(e.target.value)}
                onFocus={() => setAnchoFocus(true)}
                onBlur={() => setAnchoFocus(false)}
                placeholder="Ej: 120"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  border: `1.5px solid ${anchoFocus ? '#14008C' : '#E0E0E0'}`,
                  borderRadius: 6,
                  fontSize: 15,
                  color: '#0A0A14',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                  background: '#fff',
                }}
              />
              <span style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 13, color: '#BBB', fontWeight: 500,
              }}>
                cm
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#BBB', margin: '6px 0 0 0' }}>
              Mínimo {regla?.minimo_ancho ?? 30} cm · Máximo {regla?.maximo_ancho ?? 400} cm
            </p>
          </div>

          {/* Alto */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 12, fontWeight: 800,
              color: '#0A0A14', letterSpacing: '0.08em',
              marginBottom: 8,
            }}>
              ALTO (cm)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={regla?.minimo_alto ?? 30}
                max={regla?.maximo_alto ?? 350}
                value={altoLocal}
                onChange={e => setAltoLocal(e.target.value)}
                onFocus={() => setAltoFocus(true)}
                onBlur={() => setAltoFocus(false)}
                placeholder="Ej: 165"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  border: `1.5px solid ${altoFocus ? '#14008C' : '#E0E0E0'}`,
                  borderRadius: 6,
                  fontSize: 15,
                  color: '#0A0A14',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                  background: '#fff',
                }}
              />
              <span style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 13, color: '#BBB', fontWeight: 500,
              }}>
                cm
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#BBB', margin: '6px 0 0 0' }}>
              Mínimo {regla?.minimo_alto ?? 30} cm · Máximo {regla?.maximo_alto ?? 350} cm
            </p>
          </div>

          {/* Precio base */}
          {precioBase !== null && (
            <div style={{
              background: 'rgba(13,122,78,0.06)',
              border: '1px solid rgba(13,122,78,0.2)',
              borderRadius: 6,
              padding: '12px 16px',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 13, color: '#0D7A4E', margin: 0, fontWeight: 500 }}>
                Precio estimado base:{' '}
                <strong>${precioBase.toLocaleString('es-AR')}</strong>
                <span style={{ opacity: 0.7, fontWeight: 400 }}> (sin sistema ni instalación)</span>
              </p>
            </div>
          )}

          {/* Fuera de rango */}
          {fueraDeRango && (
            <div style={{
              background: 'rgba(20,0,140,0.05)',
              border: '1px solid rgba(20,0,140,0.15)',
              borderRadius: 6,
              padding: '14px 16px',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#14008C', margin: '0 0 8px 0' }}>
                Para estas medidas necesitamos asesorarte. ¿Hablamos?
              </p>
              <button
                onClick={onFueraDeRango}
                style={{
                  fontSize: 12, fontWeight: 700, color: '#14008C',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, textDecoration: 'underline', fontFamily: 'inherit',
                }}
              >
                Consultar por WhatsApp →
              </button>
            </div>
          )}

          {/* Tip importante */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: '#F7F7FB',
            borderRadius: 6,
            padding: '12px 16px',
          }}>
            <div style={{
              width: 32, height: 32,
              background: '#EEEEF8',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 14,
            }}>
              📏
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0A0A14', marginBottom: 2 }}>
                IMPORTANTE
              </div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                Tomá las medidas en tres puntos y usá la menor medida.
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha — Diagrama */}
        <div style={{
          background: '#fff',
          border: '1px solid #EBEBEB',
          borderRadius: 8,
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg viewBox="0 0 320 380" width="100%" height="100%" fill="none" style={{ maxHeight: 360 }}>
            {/* Fondo ventana */}
            <rect x="60" y="40" width="200" height="260" rx="4" fill="#F0F0F0" stroke="#DDD" strokeWidth="2"/>

            {/* Marco ventana */}
            <rect x="60" y="40" width="200" height="260" rx="4" fill="none" stroke="#C8C8C8" strokeWidth="6"/>

            {/* Cortina roller */}
            <rect x="62" y="40" width="196" height="160" rx="2" fill="#B0A898"/>
            {[70, 90, 110, 130, 150, 170].map(y => (
              <line key={y} x1="62" y1={y} x2="258" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
            ))}

            {/* Tubo superior */}
            <rect x="54" y="32" width="212" height="16" rx="8" fill="#8A8278"/>

            {/* Vista exterior */}
            <rect x="66" y="202" width="188" height="94" rx="2" fill="#D4E8D0" opacity="0.6"/>
            <text x="160" y="252" textAnchor="middle" fontSize="11" fill="#999">vista exterior</text>

            {/* Flecha ANCHO */}
            <line x1="60" y1="328" x2="260" y2="328" stroke="#14008C" strokeWidth="1.5"/>
            <polygon points="60,324 60,332 50,328" fill="#14008C"/>
            <polygon points="260,324 260,332 270,328" fill="#14008C"/>
            <text x="160" y="345" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14008C" letterSpacing="2">ANCHO</text>

            {/* Flecha ALTO */}
            <line x1="288" y1="40" x2="288" y2="300" stroke="#14008C" strokeWidth="1.5"/>
            <polygon points="284,40 292,40 288,30" fill="#14008C"/>
            <polygon points="284,300 292,300 288,310" fill="#14008C"/>
            <text x="308" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14008C"
              transform="rotate(90 308 175)" letterSpacing="2">ALTO</text>

            {/* Líneas guía punteadas */}
            <line x1="60" y1="310" x2="60" y2="328" stroke="#14008C" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="260" y1="310" x2="260" y2="328" stroke="#14008C" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="270" y1="40" x2="288" y2="40" stroke="#14008C" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="270" y1="300" x2="288" y2="300" stroke="#14008C" strokeWidth="1" strokeDasharray="3 3"/>
          </svg>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .medidas-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}