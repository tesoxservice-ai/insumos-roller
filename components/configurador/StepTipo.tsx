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

const CHECKS: Record<string, string[]> = {
  'Roller': ['Fácil de operar', 'Ideal para cualquier ambiente', 'Amplia variedad de telas'],
  'Verticales': ['Perfectas para ventanales grandes', 'Control preciso de luz', 'Diseño moderno'],
  'Textiles': ['Filtran la luz suavemente', 'Aportan calidez decorativa', 'Variedad de texturas'],
  'Bandas': ['Perfectas para ventanales grandes', 'Control preciso de luz', 'Diseño moderno'],
  'Tradicionales': ['Clásicas y atemporales', 'Gran variedad de diseños', 'Fácil mantenimiento'],
  'Horizontales': ['Control total de luz', 'Muy duraderas', 'Aptas para cocina y baño'],
  'Dúo': ['Privacidad + vista exterior', 'Un solo mecanismo', 'Máxima versatilidad'],
}

const IMAGEN_MAP: Record<string, string> = {
  'roller':   '/images/ROLLER.png',
  'vertical': '/images/VERTICALES.png',
  'banda':    '/images/VERTICALES.png',
  'textil':   '/images/TEXTILES.png',
}

function getImagenSrc(nombre: string): string | null {
  const lower = nombre.toLowerCase()
  for (const [key, src] of Object.entries(IMAGEN_MAP)) {
    if (lower.includes(key)) return src
  }
  return null
}

function getDescripcion(nombre: string) {
  for (const key of Object.keys(DESCRIPCIONES)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return DESCRIPCIONES[key]
  }
  return ''
}

function getChecks(nombre: string): string[] {
  for (const key of Object.keys(CHECKS)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return CHECKS[key]
  }
  return []
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
  Textiles: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="6" rx="3" fill="#C8C0B0"/>
      {[28, 44, 60, 76, 92, 108].map((y, i) => (
        <rect key={i} x="20" y={y} width="100" height="12" rx="1" fill="#E8E0D0" stroke="#D0C8B8" strokeWidth="0.5"/>
      ))}
      <rect x="20" y="120" width="100" height="8" rx="2" fill="#C8C0B0"/>
    </svg>
  ),
  Dúo: (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="15" y="18" width="110" height="8" rx="3" fill="#C8C0B0"/>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="20" y={30 + i * 13} width="100" height="8" rx="1"
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

function TipoImagen({ nombre }: { nombre: string }) {
  const src = getImagenSrc(nombre)
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: '#F5F0E8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px',
      }}>
        {getPlaceholder(nombre)}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={nombre}
      fill
      sizes="33vw"
      style={{ objectFit: 'cover', objectPosition: 'center' }}
      onError={() => setImgError(true)}
    />
  )
}

interface FlipCardProps {
  tipo: TipoCortina
  activo: boolean
  onSelect: (tipo: TipoCortina) => void
}

function FlipCard({ tipo, activo, onSelect }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const desc = getDescripcion(tipo.nombre)
  const checks = getChecks(tipo.nombre)

  return (
    <div
      style={{ perspective: '1000px', cursor: 'pointer' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => onSelect(tipo)}
    >
      <div style={{
        position: 'relative',
        paddingBottom: '140%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: 10,
      }}>

        {/* FRENTE — foto */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 10,
          overflow: 'visible',
          border: `2px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 4px rgba(20,0,140,0.1)' : '0 4px 16px rgba(0,0,0,0.08)',
          background: '#F5F0E8',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Imagen ocupa casi todo */}
          <div style={{ position: 'relative', flex: 1, borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
            <TipoImagen nombre={tipo.nombre} />
          </div>

          {/* Nombre abajo fuera de la imagen */}
          <div style={{
            padding: '14px 18px',
            background: '#fff',
            borderTop: '1px solid #EBEBEB',
            borderRadius: '0 0 8px 8px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0A0A14', letterSpacing: '0.1em' }}>
              {tipo.nombre.toUpperCase()}
            </span>
          </div>

          {activo && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              width: 26, height: 26,
              background: '#14008C',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700,
              zIndex: 2,
            }}>✓</div>
          )}

          <div style={{
            position: 'absolute', top: 14, left: 14,
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(0,0,0,0.28)',
            borderRadius: 100,
            padding: '4px 10px',
            letterSpacing: '0.06em',
            backdropFilter: 'blur(4px)',
          }}>
            VER DETALLES
          </div>
        </div>

        {/* DORSO — info */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 10,
          overflow: 'hidden',
          border: `2px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 4px rgba(20,0,140,0.1)' : '0 4px 16px rgba(0,0,0,0.08)',
          background: '#FAFAF8',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 22px 20px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#14008C', letterSpacing: '0.1em', marginBottom: 10 }}>
            {tipo.nombre.toUpperCase()}
          </div>

          <div style={{ height: 1, background: '#EBEBEB', marginBottom: 14 }} />

          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 16px 0' }}>
            {desc}
          </p>

          {checks.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checks.map((check, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15, color: '#444' }}>
                  <span style={{ color: '#0D7A4E', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                  {check}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onSelect(tipo) }}
            style={{
              marginTop: 18,
              width: '100%',
              padding: '13px',
              background: '#14008C',
              border: 'none',
              borderRadius: 7,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.06em',
              fontFamily: 'inherit',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {activo ? '✓ SELECCIONADA' : 'ELEGIR ESTE TIPO →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StepTipo({ tipos, seleccionado, onSelect }: StepTipoProps) {
  return (
    <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#14008C',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          PASO 1 DE 6
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 3.5vw, 42px)',
          fontWeight: 700, color: '#0A0A14',
          letterSpacing: '-0.02em',
          margin: '0 0 12px 0',
        }}>
          Elegí el tipo de cortina
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Pasá el mouse sobre cada tipo para ver sus características.
        </p>
      </div>

      {/* Grilla */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(tipos.length, 5)}, 1fr)`,
        gap: 20,
        marginBottom: 32,
      }}
        className="tipo-grid"
      >
        {tipos.map(tipo => (
          <FlipCard
            key={tipo.id}
            tipo={tipo}
            activo={seleccionado?.id === tipo.id}
            onSelect={onSelect}
          />
        ))}
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