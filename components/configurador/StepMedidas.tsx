'use client'

import { useState, useEffect } from 'react'
import type { Tela, ReglaPrecio } from '@/types'
import { calcularPrecio } from '@/lib/precio'
import type { ConfiguradorState } from '@/types'

interface StepMedidasProps {
  ancho: number
  alto: number
  reglas: ReglaPrecio[]
  telaSeleccionada: Tela | null
  onChange: (ancho: number, alto: number) => void
  onFueraDeRango: () => void
}

export default function StepMedidas({
  ancho,
  alto,
  reglas,
  telaSeleccionada,
  onChange,
  onFueraDeRango,
}: StepMedidasProps) {
  const [anchoLocal, setAnchoLocal] = useState(ancho > 0 ? String(ancho) : '')
  const [altoLocal, setAltoLocal] = useState(alto > 0 ? String(alto) : '')

  const regla = telaSeleccionada
    ? reglas.find((r) => r.tela_id === telaSeleccionada.id) ?? null
    : null

  const anchoNum = Number(anchoLocal)
  const altoNum = Number(altoLocal)
  const ambosIngresados = anchoNum > 0 && altoNum > 0

  const fueraDeRango = regla && ambosIngresados && (
    anchoNum < regla.minimo_ancho ||
    anchoNum > regla.maximo_ancho ||
    altoNum < regla.minimo_alto ||
    altoNum > regla.maximo_alto
  )

  const estadoDummy: ConfiguradorState = {
    tipo: null,
    tela: telaSeleccionada,
    color: null,
    colorHex: '',
    ancho: anchoNum,
    alto: altoNum,
    sistema: '',
    sistemaExtra: 0,
    instalacion: false,
    instExtra: 0,
  }

  const precioBase = ambosIngresados && !fueraDeRango
    ? calcularPrecio(estadoDummy, reglas)
    : null

  useEffect(() => {
    if (ambosIngresados) {
      onChange(anchoNum, altoNum)
    }
  }, [anchoNum, altoNum, onChange, ambosIngresados])

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Ingresá las medidas
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Medí el ancho y el alto del hueco donde va la cortina, de soporte a soporte.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
              Ancho (cm)
            </label>
            <input
              type="number"
              min={regla?.minimo_ancho ?? 30}
              max={regla?.maximo_ancho ?? 400}
              value={anchoLocal}
              onChange={(e) => setAnchoLocal(e.target.value)}
              placeholder="Ej: 120"
              className="w-full px-4 py-3 rounded-xl text-base outline-none border"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
            {regla && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Mínimo {regla.minimo_ancho} cm · Máximo {regla.maximo_ancho} cm
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
              Alto (cm)
            </label>
            <input
              type="number"
              min={regla?.minimo_alto ?? 30}
              max={regla?.maximo_alto ?? 350}
              value={altoLocal}
              onChange={(e) => setAltoLocal(e.target.value)}
              placeholder="Ej: 165"
              className="w-full px-4 py-3 rounded-xl text-base outline-none border"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
            {regla && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Mínimo {regla.minimo_alto} cm · Máximo {regla.maximo_alto} cm
              </p>
            )}
          </div>

          {precioBase !== null && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: 'var(--green-soft)',
                border: '1px solid var(--green)',
                color: 'var(--green)',
              }}
            >
              Precio estimado base:{' '}
              <span className="font-bold">
                ${precioBase.toLocaleString('es-AR')}
              </span>
              <span className="font-normal opacity-70"> (sin sistema ni instalación)</span>
            </div>
          )}

          {fueraDeRango && (
            <div
              className="rounded-xl px-4 py-3"
              style={{
                backgroundColor: 'var(--gold-soft)',
                border: '1px solid var(--gold-border)',
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--gold)' }}>
                Para estas medidas necesitamos asesorarte. ¿Hablamos?
              </p>
              <button
                onClick={onFueraDeRango}
                className="text-sm font-semibold underline"
                style={{ color: 'var(--gold)' }}
              >
                Consultar por WhatsApp →
              </button>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-center rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            minWidth: '200px',
          }}
        >
          <svg viewBox="0 0 160 200" width="160" height="200" fill="none">
            <rect x="30" y="30" width="100" height="140" rx="3"
              fill="var(--surface2)" stroke="var(--border)" strokeWidth="2"/>
            <rect x="36" y="36" width="88" height="128" fill="#1a2a3a" opacity="0.5"/>
            <line x1="30" y1="185" x2="130" y2="185" stroke="var(--gold)" strokeWidth="1.5"/>
            <polygon points="30,182 30,188 22,185" fill="var(--gold)"/>
            <polygon points="130,182 130,188 138,185" fill="var(--gold)"/>
            <text x="80" y="198" textAnchor="middle" fontSize="9" fill="var(--gold)">ANCHO</text>
            <line x1="145" y1="30" x2="145" y2="170" stroke="var(--gold)" strokeWidth="1.5"/>
            <polygon points="142,30 148,30 145,22" fill="var(--gold)"/>
            <polygon points="142,170 148,170 145,178" fill="var(--gold)"/>
            <text x="155" y="105" textAnchor="middle" fontSize="9" fill="var(--gold)"
              transform="rotate(90 155 105)">ALTO</text>
            <text x="80" y="96" textAnchor="middle" fontSize="8" fill="var(--text-muted)">
              Medí de soporte
            </text>
            <text x="80" y="107" textAnchor="middle" fontSize="8" fill="var(--text-muted)">
              a soporte
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}