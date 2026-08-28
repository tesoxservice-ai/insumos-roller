'use client'

import { useState } from 'react'
import type { ConfiguradorState } from '@/types'
import { useCart } from '@/context/CartContext'

interface PriceBarProps {
  state: ConfiguradorState
  precio: number | null
  onNext: () => void
  nextLabel: string
  onBack: () => void
  showBack: boolean
  esUltimoPaso?: boolean
}

export default function PriceBar({
  state,
  precio,
  onNext,
  nextLabel,
  onBack,
  showBack,
  esUltimoPaso = false,
}: PriceBarProps) {
  const { agregarItem } = useCart()
  const [agregado, setAgregado] = useState(false)

  function handleAgregarAlCarrito() {
    if (!precio) return
    const descripcion = [
      state.tipo?.nombre ?? '',
      state.tela?.nombre ?? '',
      state.color ?? '',
      state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : '',
      state.sistema ? `Sistema: ${state.sistema}` : '',
    ].filter(Boolean).join(' · ')

    agregarItem({
      id: `medida-${Date.now()}`,
      nombre: `Cortina ${state.tipo?.nombre ?? 'a medida'}`,
      descripcion,
      precio,
      tipo: 'medida',
    })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  return (
    <div style={{
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
      padding: '0 40px',
    }}>

      {/* Izquierda — Atrás */}
      <div style={{ width: 120, display: 'flex', justifyContent: 'flex-start' }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1.5px solid #D0D0D0',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#555',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#14008C'
              e.currentTarget.style.color = '#14008C'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#D0D0D0'
              e.currentTarget.style.color = '#555'
            }}
          >
            ← Atrás
          </button>
        )}
      </div>

      {/* Centro — Precio */}
      <div style={{ textAlign: 'center' }}>
        {precio !== null ? (
          <p style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#14008C',
            margin: 0,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            ${precio.toLocaleString('es-AR')}
          </p>
        ) : (
          <p style={{
            fontSize: 14,
            color: '#BBB',
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            Completá los pasos para ver el precio
          </p>
        )}
      </div>

      {/* Derecha — Siguiente o Agregar al carrito */}
      <div style={{ width: 180, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {esUltimoPaso && precio ? (
          <button
            onClick={handleAgregarAlCarrito}
            style={{
              padding: '11px 20px',
              background: agregado ? '#0D7A4E' : '#14008C',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
              transition: 'background 0.2s, opacity 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => !agregado && (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {agregado ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              padding: '11px 24px',
              background: '#14008C',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {nextLabel} →
          </button>
        )}
      </div>

    </div>
  )
}