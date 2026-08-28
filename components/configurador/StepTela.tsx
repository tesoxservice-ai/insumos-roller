'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Tela } from '@/types'
import StepHeader from '@/components/configurador/StepHeader'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

interface StepTelaProps {
  telas: Tela[]
  telasFiltradas: Tela[]
  seleccionada: Tela | null
  onSelect: (tela: Tela) => void
  pasoActual: number
  onClickPaso: (i: number) => void
}

const IMAGEN_MAP: Record<string, string> = {
  'blackout':  '/images/blackout.png',
  'sunscreen': '/images/sunscreen.png',
  'doble':     '/images/duo.png',
  'duo':       '/images/duo.png',
  'dúo':       '/images/duo.png',
}

function getImagenSrc(nombre: string): string | null {
  const lower = nombre.toLowerCase()
  for (const [key, src] of Object.entries(IMAGEN_MAP)) {
    if (lower.includes(key)) return src
  }
  return null
}

const COLORES_FONDO: Record<string, string> = {
  blackout:  '#2A2520',
  sunscreen: '#F0EAE0',
  doble:     '#E8E4DC',
}

function getFondo(nombre: string) {
  const lower = nombre.toLowerCase()
  for (const [key, color] of Object.entries(COLORES_FONDO)) {
    if (lower.includes(key)) return color
  }
  return '#F0EAE0'
}

const EMOJIS: Record<string, string> = {
  blackout:  '🌙',
  sunscreen: '☀️',
  doble:     '✨',
}

function getEmoji(nombre: string) {
  const lower = nombre.toLowerCase()
  for (const [key, emoji] of Object.entries(EMOJIS)) {
    if (lower.includes(key)) return emoji
  }
  return '✨'
}

function TelaImagen({ nombre }: { nombre: string }) {
  const src = getImagenSrc(nombre)
  const [imgError, setImgError] = useState(false)
  const fondo = getFondo(nombre)

  if (!src || imgError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: fondo,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48,
      }}>
        {getEmoji(nombre)}
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
  tela: Tela
  activo: boolean
  onSelect: (tela: Tela) => void
}

function FlipCard({ tela, activo, onSelect }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const esOscuro = tela.nombre.toLowerCase().includes('blackout')

  return (
    <div
      style={{ perspective: '1000px', cursor: 'pointer' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => onSelect(tela)}
    >
      <div style={{
        position: 'relative',
        paddingBottom: '140%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: 10,
      }}>

        {/* FRENTE */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 8,
          overflow: 'hidden',
          border: `1.5px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 3px rgba(20,0,140,0.1)' : '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <TelaImagen nombre={tela.nombre} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
              padding: '32px 16px 14px',
            }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                {tela.nombre.toUpperCase()}
              </span>
            </div>
            {activo && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                width: 24, height: 24, background: '#14008C',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700,
              }}>✓</div>
            )}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
              background: 'rgba(0,0,0,0.28)', borderRadius: 100,
              padding: '3px 8px', letterSpacing: '0.06em', backdropFilter: 'blur(4px)',
            }}>
              VER DETALLES
            </div>
          </div>
        </div>

        {/* DORSO */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 8, overflow: 'hidden',
          border: `1.5px solid ${activo ? '#14008C' : '#E8E8E8'}`,
          boxShadow: activo ? '0 0 0 3px rgba(20,0,140,0.1)' : '0 2px 12px rgba(0,0,0,0.06)',
          background: esOscuro ? '#1E1A18' : '#FAFAF8',
          display: 'flex', flexDirection: 'column',
          padding: '20px 20px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{getEmoji(tela.nombre)}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: esOscuro ? '#F0EAE0' : '#0A0A14', letterSpacing: '0.08em' }}>
              {tela.nombre.toUpperCase()}
            </span>
          </div>
          <div style={{ height: 1, background: esOscuro ? 'rgba(255,255,255,0.08)' : '#EBEBEB', marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: esOscuro ? '#B0A898' : '#666', lineHeight: 1.55, margin: '0 0 14px 0' }}>
            {tela.descripcion}
          </p>
          {tela.checks && tela.checks.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {tela.checks.map((check, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15, color: esOscuro ? '#C8BFB5' : '#444' }}>
                  <span style={{ color: '#0D7A4E', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                  {check}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(tela) }}
            style={{
              marginTop: 16, width: '100%', padding: '13px',
              background: activo ? '#14008C' : esOscuro ? 'rgba(255,255,255,0.1)' : '#14008C',
              border: esOscuro && !activo ? '1px solid rgba(255,255,255,0.2)' : 'none',
              borderRadius: 6, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.06em', fontFamily: 'inherit',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {activo ? '✓ SELECCIONADA' : 'ELEGIR ESTA TELA →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StepTela({
  telas, telasFiltradas, seleccionada, onSelect, pasoActual, onClickPaso,
}: StepTelaProps) {
  const lista = telasFiltradas.length > 0 ? telasFiltradas : telas

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      <div style={{ marginBottom: 36 }}>
        <StepHeader pasos={PASOS} pasoActual={pasoActual} onClickPaso={onClickPaso} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            Elegí el tipo de tela
          </h2>
          <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 20px' }} />
          <p style={{ fontSize: 17, color: '#444', margin: 0, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Pasá el mouse sobre cada tela para ver sus características.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(lista.length, 3)}, 1fr)`,
        gap: 20, marginBottom: 24,
      }} className="tela-grid">
        {lista.map(tela => (
          <FlipCard key={tela.id} tela={tela} activo={seleccionada?.id === tela.id} onSelect={onSelect} />
        ))}
      </div>

      {/* Banner simulador de luz */}
      <Link href="/simulador" target="_blank" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#F7F7FB',
          border: '1px solid #E8E8F0',
          borderRadius: 12,
          padding: '18px 24px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#14008C'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20,0,140,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#E8E8F0'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#EEEEF8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', margin: '0 0 2px 0' }}>
                ¿No sabés cuál elegir?
              </p>
              <p style={{ fontSize: 13, color: '#8888A8', margin: 0 }}>
                Probá nuestro simulador de luz y compará Sunscreen vs Blackout en tiempo real.
              </p>
            </div>
          </div>
          <span style={{ color: '#14008C', fontWeight: 700, fontSize: 18, flexShrink: 0, marginLeft: 16 }}>→</span>
        </div>
      </Link>

      <style>{`
        @media (max-width: 640px) {
          .tela-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}