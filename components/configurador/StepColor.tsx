'use client'

import type { Color } from '@/types'

interface StepColorProps {
  colores: Color[]
  coloresFiltrados: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
  tipoNombre: string
  telaNombre: string
}

export default function StepColor({
  colores,
  coloresFiltrados,
  seleccionado,
  onSelect,
  tipoNombre,
  telaNombre,
}: StepColorProps) {
  const lista = coloresFiltrados.length > 0 ? coloresFiltrados : colores

  return (
    <div className="flex flex-col gap-6">
      {/* Selector de colores */}
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14 }}>
          Elegí el color de tu cortina
        </p>
        <div className="flex flex-wrap gap-3">
          {lista.map(color => {
            const isSelected = seleccionado?.id === color.id
            return (
              <button
                key={color.id}
                onClick={() => onSelect(color)}
                title={color.nombre}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: color.hex,
                    border: isSelected
                      ? '3px solid var(--primary)'
                      : '2px solid var(--border)',
                    boxShadow: isSelected ? '0 0 0 2px var(--primary-border)' : 'none',
                    transition: 'border 0.15s, box-shadow 0.15s',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: 11,
                    maxWidth: 52,
                    textAlign: 'center',
                    lineHeight: 1.3,
                    transition: 'color 0.15s',
                  }}
                >
                  {color.nombre}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Placeholder probador visual */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          Probador visual
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Próximamente podrás ver cómo queda la cortina en tu ventana.
        </div>
      </div>
    </div>
  )
}