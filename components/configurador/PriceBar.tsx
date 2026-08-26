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
  // Descripción resumida de la configuración actual
  const partes: string[] = []
  if (state.tipo) partes.push(state.tipo.nombre)
  if (state.tela) partes.push(state.tela.nombre)
  if (state.color) partes.push(state.color.nombre)
  const descripcion = partes.join(' · ')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 border-t"
      style={{
        backgroundColor: 'rgba(26,24,20,0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
        height: '68px',
      }}
    >
      {/* Izquierda: descripción y precio */}
      <div className="flex flex-col justify-center min-w-0">
        {descripcion && (
          <p
            className="text-xs truncate"
            style={{ color: 'var(--text-muted)', maxWidth: '220px' }}
          >
            {descripcion}
          </p>
        )}
        {precio !== null ? (
          <p className="text-xl font-bold leading-tight" style={{ color: 'var(--gold)' }}>
            ${precio.toLocaleString('es-AR')}
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Completá los pasos para ver el precio
          </p>
        )}
      </div>

      {/* Derecha: botones */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {showBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-sm border transition-opacity hover:opacity-70"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-mid)',
              backgroundColor: 'transparent',
            }}
          >
            ← Atrás
          </button>
        )}
        <button
          onClick={onNext}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
