'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Color } from '@/types'
import StepHeader from '@/components/configurador/StepHeader'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

const COLORES_TRADICIONALES = [
  { id: 'trad-blanco', nombre: 'Blanco', hex: '#F5F2EC', tela_id: '', activo: true, orden: 1 },
  { id: 'trad-natural', nombre: 'Natural', hex: '#D4C9B0', tela_id: '', activo: true, orden: 2 },
  { id: 'trad-gris', nombre: 'Gris', hex: '#9E9E9E', tela_id: '', activo: true, orden: 3 },
  { id: 'trad-negro', nombre: 'Negro', hex: '#1A1A1A', tela_id: '', activo: true, orden: 4 },
]

const CAIDAS = [
  {
    key: 'detras' as const,
    label: 'Caída por detrás',
    img: '/images/CAIDA_DETRAS.png',
    desc: 'El rollo queda pegado a la pared. La tela cae entre el tubo y la pared.',
    checks: ['Más discreto y minimalista', 'Ideal para ventanas con poco espacio', 'Aspecto más limpio desde adentro'],
  },
  {
    key: 'delante' as const,
    label: 'Caída por delante',
    img: '/images/CAIDA_DELANTE.png',
    desc: 'El rollo queda separado de la pared. La tela cae por el frente.',
    checks: ['Más volumen y presencia visual', 'Mayor cobertura lateral', 'Recomendada para blackout total'],
  },
]

interface CaidaFlipCardProps {
  caida: typeof CAIDAS[0]
  activo: boolean
  onSelect: (key: 'detras' | 'delante') => void
}

function CaidaFlipCard({ caida, activo, onSelect }: CaidaFlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{ perspective: '1000px', cursor: 'pointer' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => onSelect(caida.key)}
    >
      <div style={{
        position: 'relative', paddingBottom: '130%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: 10,
      }}>
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          borderRadius: 10, overflow: 'hidden',
          border: `2px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 4px rgba(20,0,140,0.1)' : '0 4px 16px rgba(0,0,0,0.08)',
          background: '#F5F0E8', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            {!imgError ? (
              <Image src={caida.img} alt={caida.label} fill sizes="40vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8' }}>
                <svg viewBox="0 0 120 140" width="100" height="120" fill="none">
                  <rect x="20" y="18" width="80" height="8" rx="4" fill="#B0A898"/>
                  <rect x="28" y="24" width="64" height="90" rx="2" fill="#E0D8CC" opacity="0.95"/>
                  <rect x="26" y="112" width="68" height="6" rx="3" fill="#C8C0B0"/>
                </svg>
              </div>
            )}
            <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.28)', borderRadius: 100, padding: '4px 10px', letterSpacing: '0.06em', backdropFilter: 'blur(4px)' }}>
              VER DETALLES
            </div>
            {activo && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 26, height: 26, background: '#14008C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</div>
            )}
          </div>
          <div style={{ padding: '14px 18px', background: '#fff', borderTop: '1px solid #EBEBEB' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0A0A14', letterSpacing: '0.1em' }}>{caida.label.toUpperCase()}</span>
          </div>
        </div>

        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', borderRadius: 10, overflow: 'hidden',
          border: `2px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 4px rgba(20,0,140,0.1)' : '0 4px 16px rgba(0,0,0,0.08)',
          background: '#FAFAF8', display: 'flex', flexDirection: 'column', padding: '24px 22px 20px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#14008C', letterSpacing: '0.1em', marginBottom: 10 }}>{caida.label.toUpperCase()}</div>
          <div style={{ height: 1, background: '#EBEBEB', marginBottom: 14 }} />
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 16px 0' }}>{caida.desc}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {caida.checks.map((check, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15, color: '#444' }}>
                <span style={{ color: '#0D7A4E', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                {check}
              </li>
            ))}
          </ul>
          <button
            onClick={e => { e.stopPropagation(); onSelect(caida.key) }}
            style={{ marginTop: 18, width: '100%', padding: '13px', background: '#14008C', border: 'none', borderRadius: 7, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {activo ? '✓ SELECCIONADA' : 'ELEGIR ESTA CAÍDA →'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ColorPickerProps {
  label: string
  colores: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
}

function ColorPicker({ label, colores, seleccionado, onSelect }: ColorPickerProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: '#14008C', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {colores.map(color => {
          const isSelected = seleccionado?.id === color.id
          return (
            <button key={color.id} onClick={() => onSelect(color)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: '50%', background: color.hex,
                border: isSelected ? '3px solid #14008C' : '2px solid #E0E0E0',
                boxShadow: isSelected ? '0 0 0 4px rgba(20,0,140,0.12)' : '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.15s', transform: isSelected ? 'scale(1.12)' : 'scale(1)',
              }} />
              <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 400, color: isSelected ? '#14008C' : '#666', maxWidth: 72, textAlign: 'center', lineHeight: 1.3 }}>
                {color.nombre}
              </span>
            </button>
          )
        })}
      </div>
      {seleccionado && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', background: '#F7F7FB', borderRadius: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: seleccionado.hex, border: '2px solid #fff', boxShadow: '0 0 0 1.5px #DDD', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14' }}>{seleccionado.nombre}</div>
            <div style={{ fontSize: 11, color: '#BBB', marginTop: 2 }}>{seleccionado.hex.toUpperCase()}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#0D7A4E', background: 'rgba(13,122,78,0.08)', border: '1px solid rgba(13,122,78,0.2)', borderRadius: 100, padding: '5px 14px' }}>
            ✓ Seleccionado
          </div>
        </div>
      )}
    </div>
  )
}

interface StepColorProps {
  colores: Color[]
  coloresFiltrados: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
  colorInterior: Color | null
  colorExterior: Color | null
  onSelectInterior: (color: Color) => void
  onSelectExterior: (color: Color) => void
  tipoNombre: string
  telaNombre: string
  caida: 'detras' | 'delante'
  onCaidaChange: (caida: 'detras' | 'delante') => void
  pasoActual: number
  onClickPaso: (i: number) => void
}

export default function StepColor({
  colores, coloresFiltrados, seleccionado, onSelect,
  colorInterior, colorExterior, onSelectInterior, onSelectExterior,
  tipoNombre, caida, onCaidaChange, pasoActual, onClickPaso,
}: StepColorProps) {
  const lista = coloresFiltrados.length > 0 ? coloresFiltrados : colores
  const esRoller = tipoNombre.toLowerCase().includes('roller')
  const esTradicional = tipoNombre.toLowerCase().includes('tradicional')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <StepHeader pasos={PASOS} pasoActual={pasoActual} onClickPaso={onClickPaso} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            Color{esRoller ? ' y accesorios' : ''}
          </h2>
          <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 20px' }} />
          <p style={{ fontSize: 17, color: '#444', margin: 0, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            {esTradicional ? 'Elegí el color de cada capa de tu cortina.' : 'Elegí el color de tu cortina.'}
          </p>
        </div>
      </div>

      {/* COLORES */}
      {esTradicional ? (
        /* Layout 2 columnas para Tradicionales */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="tradicional-grid">

          {/* Pickers izquierda */}
          <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 10, padding: '28px 32px' }}>
            <ColorPicker
              label="Color cortina interior (voile / gasa)"
              colores={COLORES_TRADICIONALES}
              seleccionado={colorInterior}
              onSelect={onSelectInterior}
            />
            <div style={{ height: 1, background: '#F0F0F0', margin: '8px 0 24px' }} />
            <ColorPicker
              label="Color cortina exterior (blackout / opaca)"
              colores={COLORES_TRADICIONALES}
              seleccionado={colorExterior}
              onSelect={onSelectExterior}
            />
          </div>

          {/* Imagen referencia derecha */}
          <div style={{
            borderRadius: 10, overflow: 'hidden',
            border: '1px solid #EBEBEB',
            position: 'relative', minHeight: 400,
            background: '#F5F0E8',
          }}>
            <Image
              src="/images/colores/tradicional-referencia.jpg"
              alt="Referencia cortina tradicional"
              fill
              style={{ objectFit: 'cover' }}
              sizes="450px"
            />
          </div>
        </div>
      ) : (
        /* Picker normal para otros tipos */
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 10, padding: '28px 32px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#14008C', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>
            Color de la tela
          </p>
          {lista.length === 0 ? (
            <p style={{ fontSize: 15, color: '#BBB' }}>No hay colores disponibles para esta tela.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {lista.map(color => {
                const isSelected = seleccionado?.id === color.id
                return (
                  <button key={color.id} onClick={() => onSelect(color)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%', background: color.hex,
                      border: isSelected ? '3px solid #14008C' : '2px solid #E0E0E0',
                      boxShadow: isSelected ? '0 0 0 4px rgba(20,0,140,0.12)' : '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.15s', transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    }} />
                    <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 400, color: isSelected ? '#14008C' : '#666', maxWidth: 72, textAlign: 'center', lineHeight: 1.3 }}>
                      {color.nombre}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {seleccionado && (
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: '#F7F7FB', borderRadius: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: seleccionado.hex, border: '2px solid #fff', boxShadow: '0 0 0 1.5px #DDD', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A14' }}>{seleccionado.nombre}</div>
                <div style={{ fontSize: 12, color: '#BBB', marginTop: 2 }}>{seleccionado.hex.toUpperCase()}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#0D7A4E', background: 'rgba(13,122,78,0.08)', border: '1px solid rgba(13,122,78,0.2)', borderRadius: 100, padding: '5px 14px' }}>
                ✓ Seleccionado
              </div>
            </div>
          )}
        </div>
      )}

      {/* CAÍDA DEL ROLLO — solo para Roller */}
      {esRoller && (
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 10, padding: '28px 32px' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#14008C', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
            Caída del rollo
          </p>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 28, lineHeight: 1.6 }}>
            Define cómo se enrolla la cortina y cómo queda instalada en la ventana. Pasá el mouse sobre cada opción para ver los detalles.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 780 }} className="caida-grid">
            {CAIDAS.map(c => (
              <CaidaFlipCard key={c.key} caida={c} activo={caida === c.key} onSelect={onCaidaChange} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .tradicional-grid { grid-template-columns: 1fr !important; }
          .caida-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
} 