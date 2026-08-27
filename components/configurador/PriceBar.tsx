'use client'

import type { ConfiguradorState } from '@/types'

interface PriceBarProps {
  state: ConfiguradorState
  precio: number | null
  onNext: () => void
  nextLabel: string
  onBack: () => void
  showBack: boolean
}

export default function PriceBar({
  state,
  precio,
  onNext,
  nextLabel,
  onBack,
  showBack,
}: PriceBarProps) {
  const partes: string[] = []
  if (state.tipo) partes.push(state.tipo.nombre)
  if (state.tela) partes.push(state.tela.nombre)
  if (state.color) partes.push(state.color.nombre)
  const descripcion = partes.join(' · ')

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #EBEBEB',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      {/* Izquierda — descripción y precio */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        {descripcion && (
          <p style={{
            fontSize: 11,
            color: '#BBB',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 280,
            letterSpacing: '0.03em',
          }}>
            {descripcion}
          </p>
        )}
        {precio !== null ? (
          <p style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#0A0A14',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            ${precio.toLocaleString('es-AR')}
            <span style={{ fontSize: 11, fontWeight: 400, color: '#BBB', marginLeft: 6 }}>
              estimado
            </span>
          </p>
        ) : (
          <p style={{ fontSize: 12, color: '#BBB', margin: 0 }}>
            Completá los pasos para ver el precio
          </p>
        )}
      </div>

      {/* Derecha — botones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1.5px solid #E0E0E0',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              color: '#888',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#14008C'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}
          >
            ← Atrás
          </button>
        )}
        <button
          onClick={onNext}
          style={{
            padding: '11px 28px',
            background: '#14008C',
            border: 'none',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.04em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}