'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { TipoCortina } from '@/types'

interface StepTipoProps {
  tipos: TipoCortina[]
  seleccionado: TipoCortina | null
  onSelect: (tipo: TipoCortina) => void
}

const DESCRIPCIONES: Record<string, string> = {
  'Roller': 'Minimalistas, prácticas y versátiles. Ideales para cualquier ambiente.',
  'Verticales': 'Elegantes y funcionales. Ideales para grandes ventanales.',
  'Tradicionales': 'Clásicas y decorativas. Aportan calidez y estilo.',
  'Horizontales': 'Control de luz y privacidad. Calidad y durabilidad.',
  'Dúo': 'Diseño innovador que combina transparencia y privacidad.',
  'Textiles': 'Elegantes y decorativas. Filtran la luz con suavidad.',
  'Bandas': 'Elegantes y funcionales. Ideales para grandes ventanales.',
}

// Mapeo nombre → archivo en /public/images/
const IMAGEN_MAP: Record<string, string> = {
  'roller':    '/images/ROLLER.png',
  'vertical':  '/images/VERTICALES.png',
  'banda':     '/images/VERTICALES.png',
  'textil':    '/images/TEXTILES.png',
}

function getImagenSrc(nombre: string): string | null {
  const lower = nombre.toLowerCase()
  for (const [key, src] of Object.entries(IMAGEN_MAP)) {
    if (lower.includes(key)) return src
  }
  return null
}

const PLACEHOLDERS: Record<string, React.ReactNode> = {
  Roller: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="20" y="18" width="100" height="12" rx="6" fill="#C8C0B0"/>
      <ellipse cx="70" cy="18" rx="12" ry="8" fill="#B8B0A0"/>
      <rect x="22" y="28" width="96" height="110" rx="2" fill="#E8E0D0"/>
      {[45, 62, 79, 96, 113].map(y => (
        <line key={y} x1="22" y1={y} x2="118" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      ))}
      <rect x="22" y="136" width="96" height="8" rx="2" fill="#C8C0B0"/>
      <line x1="108" y1="30" x2="108" y2="136" stroke="#C8C0B0" strokeWidth="2"/>
      <circle cx="108" cy="144" r="4" fill="#C8C0B0"/>
    </svg>
  ),
  Verticales: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="8" rx="3" fill="#C8C0B0"/>
      {[20, 36, 52, 68, 84, 100, 116].map((x, i) => (
        <rect key={i} x={x} y="26" width="12" height="118" rx="2" fill="#E8E0D0" stroke="#D0C8B8" strokeWidth="0.5"/>
      ))}
    </svg>
  ),
  Tradicionales: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="6" rx="3" fill="#C8C0B0"/>
      {[28, 44, 60, 76, 92, 108].map((y, i) => (
        <rect key={i} x="20" y={y} width="100" height="12" rx="1" fill="#E8E0D0" stroke="#D0C8B8" strokeWidth="0.5"/>
      ))}
      <rect x="20" y="120" width="100" height="8" rx="2" fill="#C8C0B0"/>
      <line x1="118" y1="24" x2="118" y2="122" stroke="#C8C0B0" strokeWidth="1.5"/>
      <circle cx="118" cy="128" r="3" fill="#C8C0B0"/>
    </svg>
  ),
  Horizontales: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="8" rx="3" fill="#C8C0B0"/>
      {[32, 46, 60, 74, 88, 102, 116, 130].map((y, i) => (
        <rect key={i} x="20" y={y} width="100" height="8" rx="1" fill="#E8E0D0" stroke="#D0C8B8" strokeWidth="0.5"/>
      ))}
    </svg>
  ),
  Dúo: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="8" rx="3" fill="#C8C0B0"/>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x="20" y={30 + i * 13} width="100" height="8" rx="1"
          fill={i % 2 === 0 ? '#E8E0D0' : 'rgba(200,192,176,0.25)'}
          stroke="#D0C8B8" strokeWidth="0.5"
        />
      ))}
    </svg>
  ),
}

function getPlaceholder(nombre: string) {
  for (const key of Object.keys(PLACEHOLDERS)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return PLACEHOLDERS[key]
  }
  return PLACEHOLDERS['Roller']
}

function getDescripcion(nombre: string) {
  for (const key of Object.keys(DESCRIPCIONES)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return DESCRIPCIONES[key]
  }
  return ''
}

// Componente interno que maneja imagen real + fallback SVG
function TipoImagen({ nombre }: { nombre: string }) {
  const src = getImagenSrc(nombre)
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    return <>{getPlaceholder(nombre)}</>
  }

  return (
    <Image
      src={src}
      alt={nombre}
      fill
      sizes="(max-width: 640px) 33vw, 20vw"
      style={{ objectFit: 'cover', objectPosition: 'center' }}
      onError={() => setImgError(true)}
    />
  )
}

export default function StepTipo({ tipos, seleccionado, onSelect }: StepTipoProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#14008C',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          PASO 1 DE 6
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700,
          color: '#0A0A14',
          letterSpacing: '-0.02em',
          margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Elegí el tipo de cortina
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 14, color: '#999', margin: 0, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Cada tipo tiene características únicas para distintos ambientes y necesidades.
        </p>
      </div>

      {/* Grilla */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(tipos.length, 5)}, 1fr)`,
        gap: 16,
        marginBottom: 32,
      }}
        className="tipo-grid"
      >
        {tipos.map(tipo => {
          const activo = seleccionado?.id === tipo.id
          const hover = hoverId === tipo.id
          const desc = getDescripcion(tipo.nombre)
          const tieneImagen = !!getImagenSrc(tipo.nombre)

          return (
            <div
              key={tipo.id}
              onClick={() => onSelect(tipo)}
              onMouseEnter={() => setHoverId(tipo.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                cursor: 'pointer',
                border: `1.5px solid ${activo ? '#14008C' : hover ? '#C0C0D8' : '#EBEBEB'}`,
                borderRadius: 6,
                overflow: 'hidden',
                transition: 'all 0.18s',
                background: activo ? '#F7F7FB' : '#fff',
                boxShadow: hover && !activo ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {/* Zona de imagen */}
              <div style={{
                background: '#F5F0E8',
                aspectRatio: '3/4',
                position: 'relative',
                overflow: 'hidden',
                // Padding solo si es SVG (sin imagen real)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: tieneImagen ? 0 : '24px 20px',
              }}>
                <TipoImagen nombre={tipo.nombre} />

                {activo && (
                  <div style={{
                    position: 'absolute',
                    top: 10, right: 10,
                    width: 22, height: 22,
                    background: '#14008C',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    zIndex: 2,
                  }}>
                    ✓
                  </div>
                )}

                {/* Overlay sutil al hover para imagen real */}
                {tieneImagen && hover && !activo && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(20,0,140,0.06)',
                    zIndex: 1,
                  }} />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '14px 14px 16px' }}>
                <div style={{
                  fontSize: 12, fontWeight: 800,
                  color: activo ? '#14008C' : '#0A0A14',
                  letterSpacing: '0.06em',
                  marginBottom: 5,
                }}>
                  {tipo.nombre.toUpperCase()}
                </div>
                <p style={{
                  fontSize: 11, color: '#999',
                  lineHeight: 1.5, margin: '0 0 10px 0',
                }}>
                  {desc}
                </p>
                <span style={{
                  fontSize: 16,
                  color: activo ? '#14008C' : hover ? '#14008C' : '#CCC',
                  transition: 'color 0.15s',
                }}>
                  →
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Banner ayuda */}
      <div style={{
        background: '#F7F7FB',
        border: '1px solid #E8E8F0',
        borderRadius: 6,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36,
            background: '#EEEEF8',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            ?
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A14', marginBottom: 2 }}>
              ¿No sabés cuál elegir?
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              Te ayudamos a encontrar la mejor opción para vos.
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#14008C', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.04em', cursor: 'pointer',
          borderBottom: '1.5px solid #14008C',
          paddingBottom: 1,
        }}>
          VER GUÍA DE TIPOS →
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .tipo-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .tipo-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}