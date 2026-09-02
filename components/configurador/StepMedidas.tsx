'use client'

import { useState, useEffect } from 'react'
import type { Tela, ReglaPrecio } from '@/types'
import { estaEnRango, MIN_ANCHO, MAX_ANCHO, MIN_ALTO, MAX_ALTO } from '@/lib/precio'
import StepHeader from '@/components/configurador/StepHeader'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

interface StepMedidasProps {
  ancho: number
  alto: number
  reglas: ReglaPrecio[]
  telaSeleccionada: Tela | null
  onChange: (ancho: number, alto: number) => void
  onFueraDeRango: () => void
  pasoActual: number
  onClickPaso: (i: number) => void
}

export default function StepMedidas({
  ancho,
  alto,
  reglas,
  telaSeleccionada,
  onChange,
  onFueraDeRango,
  pasoActual,
  onClickPaso,
}: StepMedidasProps) {
  const [anchoLocal, setAnchoLocal] = useState(ancho > 0 ? String(ancho) : '')
  const [altoLocal, setAltoLocal] = useState(alto > 0 ? String(alto) : '')
  const [anchoFocus, setAnchoFocus] = useState(false)
  const [altoFocus, setAltoFocus] = useState(false)

  const anchoNum = Number(anchoLocal)
  const altoNum = Number(altoLocal)
  const ambosIngresados = anchoNum > 0 && altoNum > 0
  const fueraDeRango = ambosIngresados && !estaEnRango(anchoNum, altoNum)

  useEffect(() => {
    if (ambosIngresados) onChange(anchoNum, altoNum)
  }, [anchoNum, altoNum, onChange, ambosIngresados])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <StepHeader pasos={PASOS} pasoActual={pasoActual} onClickPaso={onClickPaso} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            Ingresá las medidas
          </h2>
          <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 20px' }} />
          <p style={{ fontSize: 17, color: '#444', margin: 0, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Medí el ancho y el alto del hueco donde va la cortina, de soporte a soporte.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="medidas-layout">
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 10, padding: '32px 36px 28px' }}>

          {/* Ancho */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#14008C', letterSpacing: '0.14em', marginBottom: 12 }}>ANCHO (cm)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={MIN_ANCHO}
                max={MAX_ANCHO}
                value={anchoLocal}
                onChange={e => setAnchoLocal(e.target.value)}
                onFocus={() => setAnchoFocus(true)}
                onBlur={() => setAnchoFocus(false)}
                placeholder="Ej: 120"
                style={{
                  width: '100%', padding: '18px 60px 18px 20px',
                  border: `1.5px solid ${anchoFocus ? '#14008C' : '#E0E0E0'}`,
                  borderRadius: 10, fontSize: 20, color: '#0A0A14',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.15s', background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#BBB', fontWeight: 600 }}>cm</span>
            </div>
            <p style={{ fontSize: 13, color: '#BBB', margin: '10px 0 0 0' }}>
              Mínimo {MIN_ANCHO} cm · Máximo {MAX_ANCHO} cm
            </p>
          </div>

          {/* Alto */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#14008C', letterSpacing: '0.14em', marginBottom: 12 }}>ALTO (cm)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={MIN_ALTO}
                max={MAX_ALTO}
                value={altoLocal}
                onChange={e => setAltoLocal(e.target.value)}
                onFocus={() => setAltoFocus(true)}
                onBlur={() => setAltoFocus(false)}
                placeholder="Ej: 165"
                style={{
                  width: '100%', padding: '18px 60px 18px 20px',
                  border: `1.5px solid ${altoFocus ? '#14008C' : '#E0E0E0'}`,
                  borderRadius: 10, fontSize: 20, color: '#0A0A14',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.15s', background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#BBB', fontWeight: 600 }}>cm</span>
            </div>
            <p style={{ fontSize: 13, color: '#BBB', margin: '10px 0 0 0' }}>
              Mínimo {MIN_ALTO} cm · Máximo {MAX_ALTO} cm
            </p>
          </div>

          {/* Fuera de rango */}
          {fueraDeRango && (
            <div style={{ background: 'rgba(20,0,140,0.05)', border: '1px solid rgba(20,0,140,0.15)', borderRadius: 8, padding: '16px 18px', marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#14008C', margin: '0 0 10px 0' }}>
                Las medidas deben estar entre {MIN_ANCHO}-{MAX_ANCHO} cm de ancho y {MIN_ALTO}-{MAX_ALTO} cm de alto. ¿Necesitás medidas especiales?
              </p>
              <button
                onClick={onFueraDeRango}
                style={{ fontSize: 15, fontWeight: 700, color: '#14008C', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}
              >
                Consultar por WhatsApp →
              </button>
            </div>
          )}

          {/* Link guía */}
          <a
            href="/guia-medicion" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#F7F7FB', borderRadius: 10, padding: '18px 20px', textDecoration: 'none', border: '1.5px solid transparent', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#14008C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20,0,140,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ width: 42, height: 42, background: '#EEEEF8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>📏</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#14008C', letterSpacing: '0.1em', marginBottom: 6 }}>¿NO SABÉS CÓMO TOMAR TU MEDIDA?</div>
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.55 }}>Mirá nuestra guía paso a paso y aprendé a medir correctamente tu ventana.</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#14008C', marginTop: 8 }}>Ver guía de medición →</div>
            </div>
          </a>
        </div>

        {/* Diagrama SVG */}
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 10, padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 480 }}>
          <svg viewBox="0 0 320 380" width="100%" height="100%" fill="none" style={{ maxHeight: 480 }}>
            <rect x="60" y="40" width="200" height="260" rx="4" fill="#F0F0F0" stroke="#DDD" strokeWidth="2"/>
            <rect x="60" y="40" width="200" height="260" rx="4" fill="none" stroke="#C8C8C8" strokeWidth="6"/>
            <rect x="62" y="40" width="196" height="160" rx="2" fill="#B0A898"/>
            {[70,90,110,130,150,170].map(y => <line key={y} x1="62" y1={y} x2="258" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>)}
            <rect x="54" y="32" width="212" height="16" rx="8" fill="#8A8278"/>
            <rect x="66" y="202" width="188" height="94" rx="2" fill="#D4E8D0" opacity="0.6"/>
            <text x="160" y="252" textAnchor="middle" fontSize="11" fill="#999">vista exterior</text>
            <line x1="60" y1="328" x2="260" y2="328" stroke="#14008C" strokeWidth="1.5"/>
            <polygon points="60,324 60,332 50,328" fill="#14008C"/>
            <polygon points="260,324 260,332 270,328" fill="#14008C"/>
            <text x="160" y="345" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14008C" letterSpacing="2">ANCHO</text>
            <line x1="288" y1="40" x2="288" y2="300" stroke="#14008C" strokeWidth="1.5"/>
            <polygon points="284,40 292,40 288,30" fill="#14008C"/>
            <polygon points="284,300 292,300 288,310" fill="#14008C"/>
            <text x="308" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14008C" transform="rotate(90 308 175)" letterSpacing="2">ALTO</text>
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