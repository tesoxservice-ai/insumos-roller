'use client'

import { useState } from 'react'
import type { Tela } from '@/types'

interface StepTelaProps {
  telas: Tela[]
  telasFiltradas: Tela[]
  seleccionada: Tela | null
  onSelect: (tela: Tela) => void
}

const EMOJI_POR_TELA: Record<string, string> = {
  blackout: '🌙',
  sunscreen: '☀️',
  doble: '✨',
}

function getEmoji(nombre: string): string {
  const key = Object.keys(EMOJI_POR_TELA).find((k) =>
    nombre.toLowerCase().includes(k)
  )
  return key ? EMOJI_POR_TELA[key] : '🪟'
}

type NivelLuz = 'sunscreen3' | 'sunscreen5' | 'blackout'

const NIVELES: { id: NivelLuz; label: string; valor: number; desc: string }[] = [
  { id: 'sunscreen3', label: 'Sunscreen 3%', valor: 15, desc: 'Máxima transparencia' },
  { id: 'sunscreen5', label: 'Sunscreen 5%', valor: 45, desc: 'Filtrado equilibrado' },
  { id: 'blackout', label: 'Blackout', valor: 85, desc: 'Oscuridad total' },
]

function nivelDesdeValor(valor: number): NivelLuz | null {
  if (valor <= 20) return 'sunscreen3'
  if (valor <= 60) return 'sunscreen5'
  if (valor >= 75) return 'blackout'
  return null
}

function labelEstado(valor: number): string {
  if (valor <= 20) return 'SUNSCREEN 3% — Máxima transparencia'
  if (valor <= 60) return 'SUNSCREEN 5% — Filtrado equilibrado'
  return 'BLACKOUT — Oscuridad total'
}

export default function StepTela({ telasFiltradas, seleccionada, onSelect }: StepTelaProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [luzValor, setLuzValor] = useState(85)

  const nivelActivo = nivelDesdeValor(luzValor)

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Elegí la tela
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Cada tela tiene propiedades únicas de luz, privacidad y temperatura.
      </p>

      {/* Grilla de telas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {telasFiltradas.map((tela) => {
          const activa = seleccionada?.id === tela.id
          const hovered = hoverId === tela.id

          return (
            <button
              key={tela.id}
              onClick={() => onSelect(tela)}
              onMouseEnter={() => setHoverId(tela.id)}
              onMouseLeave={() => setHoverId(null)}
              className="rounded-xl border text-left transition-all duration-150 overflow-hidden"
              style={{
                backgroundColor: activa ? 'var(--gold-soft)' : 'var(--surface)',
                borderColor: activa ? 'var(--gold)' : hovered ? 'var(--gold-border)' : 'var(--border)',
                borderWidth: activa ? '2px' : '1px',
              }}
            >
              {/* Header */}
              <div className="p-4 pb-2 flex items-start gap-3">
                <span className="text-3xl">{getEmoji(tela.nombre)}</span>
                <div>
                  <p className="font-semibold" style={{ color: activa ? 'var(--gold)' : 'var(--text)' }}>
                    {tela.nombre}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {tela.descripcion}
                  </p>
                </div>
              </div>

              {/* Checks — siempre visibles en mobile, en hover en desktop */}
              <div
                className="px-4 pb-4 pt-2 flex flex-col gap-1.5 transition-all"
                style={{ display: hovered || activa ? 'flex' : 'none' }}
              >
                {tela.checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }}>✓</span>
                    <span className="text-xs" style={{ color: 'var(--text-mid)' }}>{check}</span>
                  </div>
                ))}
              </div>

              {/* Checks mobile (siempre visibles) */}
              <div
                className="px-4 pb-4 pt-2 flex-col gap-1.5 md:hidden"
                style={{ display: 'flex' }}
              >
                {tela.checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }}>✓</span>
                    <span className="text-xs" style={{ color: 'var(--text-mid)' }}>{check}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Simulador de luz */}
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--gold)' }}>
          ✦ ¿Cuánta luz querés que entre?
        </h3>

        {/* SVG habitación */}
        <div className="relative w-full rounded-lg overflow-hidden mb-4" style={{ height: '180px', backgroundColor: '#1c2a1c' }}>
          <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Piso */}
            <rect x="0" y="140" width="400" height="40" fill="#2a1f0e" opacity="0.9"/>
            {/* Pared izquierda */}
            <rect x="0" y="0" width="80" height="140" fill="#1a1410" opacity="0.9"/>
            {/* Pared derecha */}
            <rect x="320" y="0" width="80" height="140" fill="#1a1410" opacity="0.9"/>
            {/* Techo */}
            <rect x="0" y="0" width="400" height="30" fill="#1a1410" opacity="0.9"/>
            {/* Marco ventana */}
            <rect x="85" y="20" width="230" height="120" rx="2" fill="#0a0a08" stroke="#2E2A24" strokeWidth="3"/>
            {/* Luz exterior que entra */}
            <rect x="88" y="23" width="224" height="114" fill="#e8d5a0" opacity={0.08 + (1 - luzValor / 100) * 0.55}/>
            {/* Overlay de cortina */}
            <rect x="88" y="23" width="224" height="114" fill="#0F0E0C" opacity={luzValor / 100 * 0.92}/>
            {/* Barra cortina */}
            <rect x="82" y="18" width="236" height="7" rx="2" fill="#C9A84C" opacity="0.7"/>
            {/* Lámpara */}
            <ellipse cx="200" cy="32" rx="20" ry="6" fill="#C9A84C" opacity="0.3"/>
            <rect x="198" y="30" width="4" height="16" fill="#C9A84C" opacity="0.4"/>
            <ellipse cx="200" cy="52" rx="14" ry="8" fill="#C9A84C" opacity={0.15 + luzValor / 100 * 0.2}/>
          </svg>
        </div>

        {/* Label estado */}
        <p className="text-xs font-semibold text-center mb-3" style={{ color: 'var(--gold)' }}>
          {labelEstado(luzValor)}
        </p>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={100}
          value={luzValor}
          onChange={(e) => setLuzValor(Number(e.target.value))}
          className="w-full mb-4 accent-yellow-500"
          style={{ accentColor: 'var(--gold)' }}
        />

        {/* Botones de nivel */}
        <div className="flex gap-2 justify-center flex-wrap">
          {NIVELES.map((nivel) => (
            <button
              key={nivel.id}
              onClick={() => setLuzValor(nivel.valor)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
              style={{
                backgroundColor: nivelActivo === nivel.id ? 'var(--gold-soft)' : 'var(--surface2)',
                borderColor: nivelActivo === nivel.id ? 'var(--gold)' : 'var(--border)',
                color: nivelActivo === nivel.id ? 'var(--gold)' : 'var(--text-mid)',
              }}
            >
              {nivel.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
