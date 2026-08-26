'use client'

import type { Color } from '@/types'

interface StepColorProps {
  colores: Color[]
  coloresFiltrados: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
}

export default function StepColor({ coloresFiltrados, seleccionado, onSelect }: StepColorProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Elegí el color
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Todos los colores están disponibles en la tela seleccionada.
      </p>

      {/* Swatches */}
      <div className="flex flex-wrap gap-4 mb-4">
        {coloresFiltrados.map((color) => {
          const activo = seleccionado?.id === color.id
          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              title={color.nombre}
              className="flex flex-col items-center gap-2 group"
            >
              <span
                className="block rounded-full border-2 transition-all duration-150"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: color.hex,
                  borderColor: activo ? 'var(--gold)' : 'transparent',
                  transform: activo ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: activo ? '0 0 0 3px var(--gold-soft)' : 'none',
                }}
              />
              <span
                className="text-xs font-medium transition-colors"
                style={{
                  color: activo ? 'var(--gold)' : 'var(--text-muted)',
                  maxWidth: '60px',
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}
              >
                {color.nombre}
              </span>
            </button>
          )
        })}
      </div>

      {/* Nombre seleccionado */}
      {seleccionado && (
        <p className="text-sm mb-8" style={{ color: 'var(--text-mid)' }}>
          Seleccionado:{' '}
          <span className="font-semibold" style={{ color: 'var(--gold)' }}>
            {seleccionado.nombre}
          </span>
        </p>
      )}

      {/* Placeholder probador visual */}
      <div
        className="mt-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        {/* Ícono cámara */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="2" y="10" width="32" height="22" rx="4" stroke="var(--text-muted)" strokeWidth="1.5"/>
          <circle cx="18" cy="21" r="6" stroke="var(--text-muted)" strokeWidth="1.5"/>
          <rect x="12" y="6" width="12" height="5" rx="2" stroke="var(--text-muted)" strokeWidth="1.5"/>
          <circle cx="28" cy="15" r="1.5" fill="var(--text-muted)"/>
        </svg>

        <p className="font-semibold text-sm" style={{ color: 'var(--text-mid)' }}>
          Probador visual
        </p>
        <p className="text-xs text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Próximamente podrás ver cómo queda la cortina en tu ventana.
        </p>

        {/* Badge */}
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            backgroundColor: 'var(--gold-soft)',
            color: 'var(--gold)',
            border: '1px solid var(--gold-border)',
          }}
        >
          ✦ Próximamente
        </span>
      </div>
    </div>
  )
}
