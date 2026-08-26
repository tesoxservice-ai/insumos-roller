'use client'

import { useState } from 'react'
import type { TipoCortina } from '@/types'

interface StepTipoProps {
  tipos: TipoCortina[]
  seleccionado: TipoCortina | null
  onSelect: (tipo: TipoCortina) => void
}

const SVG_POR_TIPO: Record<string, React.ReactNode> = {
  Roller: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="8" width="60" height="6" rx="3" fill="var(--gold)" opacity="0.8"/>
      <rect x="18" y="14" width="44" height="52" rx="2" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1"/>
      <rect x="18" y="14" width="44" height="8" fill="var(--gold)" opacity="0.3"/>
      <line x1="18" y1="26" x2="62" y2="26" stroke="var(--border)" strokeWidth="0.8"/>
      <line x1="18" y1="34" x2="62" y2="34" stroke="var(--border)" strokeWidth="0.8"/>
      <line x1="18" y1="42" x2="62" y2="42" stroke="var(--border)" strokeWidth="0.8"/>
      <line x1="18" y1="50" x2="62" y2="50" stroke="var(--border)" strokeWidth="0.8"/>
      <rect x="37" y="66" width="6" height="8" rx="2" fill="var(--gold)" opacity="0.6"/>
    </svg>
  ),
  Verticales: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="8" width="64" height="4" rx="2" fill="var(--gold)" opacity="0.8"/>
      {[16, 26, 36, 46, 56].map((x, i) => (
        <rect
          key={i}
          x={x} y="12" width="8" height="58" rx="1"
          fill="var(--surface2)"
          stroke="var(--border)"
          strokeWidth="1"
          opacity={0.6 + i * 0.08}
        />
      ))}
    </svg>
  ),
  Tradicionales: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="8" width="64" height="4" rx="2" fill="var(--gold)" opacity="0.8"/>
      <path d="M12 12 Q20 30 12 48 Q20 66 12 72" stroke="var(--text-mid)" strokeWidth="2" fill="none"/>
      <path d="M68 12 Q60 30 68 48 Q60 66 68 72" stroke="var(--text-mid)" strokeWidth="2" fill="none"/>
      <path d="M12 12 C20 18 60 18 68 12" stroke="var(--text-mid)" strokeWidth="1.5" fill="var(--surface2)" opacity="0.6"/>
      <path d="M12 28 C25 32 55 32 68 28" stroke="var(--border)" strokeWidth="1" fill="none"/>
      <path d="M12 44 C25 48 55 48 68 44" stroke="var(--border)" strokeWidth="1" fill="none"/>
      <path d="M12 60 C25 64 55 64 68 60" stroke="var(--border)" strokeWidth="1" fill="none"/>
    </svg>
  ),
  Horizontales: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="8" width="60" height="5" rx="2" fill="var(--gold)" opacity="0.8"/>
      {[18, 27, 36, 45, 54, 63].map((y, i) => (
        <rect key={i} x="14" y={y} width="52" height="6" rx="1"
          fill="var(--surface2)" stroke="var(--border)" strokeWidth="0.8"
          opacity={0.5 + i * 0.08}
        />
      ))}
      <line x1="40" y1="13" x2="40" y2="72" stroke="var(--border)" strokeWidth="0.6" strokeDasharray="2 2"/>
    </svg>
  ),
  Dúo: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="8" width="60" height="5" rx="2" fill="var(--gold)" opacity="0.8"/>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x="14" y={14 + i * 7} width="52" height="4" rx="1"
          fill={i % 2 === 0 ? 'var(--surface2)' : 'var(--gold)'}
          opacity={i % 2 === 0 ? 0.7 : 0.2}
          stroke="var(--border)" strokeWidth="0.5"
        />
      ))}
    </svg>
  ),
}

function getSvg(nombre: string) {
  for (const key of Object.keys(SVG_POR_TIPO)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return SVG_POR_TIPO[key]
  }
  return SVG_POR_TIPO['Roller']
}

export default function StepTipo({ tipos, seleccionado, onSelect }: StepTipoProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [expandidoMobile, setExpandidoMobile] = useState<string | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Elegí el tipo de cortina
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Cada tipo tiene características únicas para distintos ambientes y necesidades.
      </p>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {tipos.map((tipo) => {
          const activo = seleccionado?.id === tipo.id
          const conTooltip = hoverId === tipo.id
          const expandido = expandidoMobile === tipo.id

          return (
            <div key={tipo.id} className="relative flex flex-col gap-2">
              <button
                onClick={() => {
                  onSelect(tipo)
                  setExpandidoMobile(expandido ? null : tipo.id)
                }}
                onMouseEnter={() => setHoverId(tipo.id)}
                onMouseLeave={() => setHoverId(null)}
                className="flex flex-col items-center rounded-xl border transition-all duration-150 overflow-hidden"
                style={{
                  backgroundColor: activo ? 'var(--gold-soft)' : 'var(--surface)',
                  borderColor: activo ? 'var(--gold)' : conTooltip ? 'var(--gold-border)' : 'var(--border)',
                  borderWidth: activo ? '2px' : '1px',
                }}
              >
                {/* Área visual */}
                <div
                  className="w-full flex items-center justify-center p-2"
                  style={{ height: '120px', backgroundColor: 'var(--surface2)' }}
                >
                  <div className="w-16 h-16">
                    {getSvg(tipo.nombre)}
                  </div>
                </div>

                {/* Nombre */}
                <div className="py-2 px-1 text-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: activo ? 'var(--gold)' : 'var(--text)' }}
                  >
                    {tipo.nombre}
                  </span>
                </div>

                {/* Tooltip desktop */}
                {conTooltip && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 w-48 p-3 rounded-lg text-left shadow-lg pointer-events-none"
                    style={{ backgroundColor: '#0a0908', border: '1px solid var(--border)' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                      {tipo.tooltip}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                      {tipo.descripcion}
                    </p>
                  </div>
                )}
              </button>

              {/* Tooltip mobile expandible */}
              {expandido && (
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {tipo.tooltip}
                  </p>
                  <p className="leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                    {tipo.descripcion}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
