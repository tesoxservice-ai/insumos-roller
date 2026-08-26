'use client'

import { useState } from 'react'
import type { ItemPresupuesto } from '@/types'

interface PresupuestoPanelProps {
  items: ItemPresupuesto[]
  totalGeneral: number
  onEliminar: (index: number) => void
  onLimpiar: () => void
  onDescargarPDF: () => void
  onEnviarEmail: (email: string) => void
}

export default function PresupuestoPanel({
  items,
  totalGeneral,
  onEliminar,
  onLimpiar,
  onDescargarPDF,
  onEnviarEmail,
}: PresupuestoPanelProps) {
  const [emailVisible, setEmailVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleEnviar = async () => {
    if (!email.trim()) return
    setEnviando(true)
    await onEnviarEmail(email.trim())
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => {
      setEnviado(false)
      setEmailVisible(false)
      setEmail('')
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            Mi presupuesto
          </span>
          {items.length > 0 && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--bg)' }}
            >
              {items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={onLimpiar}
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 px-4 py-12 text-center"
          >
            <span className="text-3xl opacity-30">🪟</span>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Todavía no agregaste ambientes
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              Configurá una cortina y agregala a tu presupuesto
            </p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {items.map((item, i) => (
              <li
                key={i}
                className="px-4 py-3 flex items-start gap-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {item.ambiente}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                    {item.configuracion.tipo?.nombre} · {item.configuracion.tela?.nombre} · {item.configuracion.color?.nombre}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {item.configuracion.ancho} × {item.configuracion.alto} cm
                  </p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--gold)' }}>
                    ${item.precioEstimado.toLocaleString('es-AR')}
                  </p>
                </div>
                <button
                  onClick={() => onEliminar(i)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all hover:opacity-70"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                  }}
                  title="Eliminar"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div
          className="flex-shrink-0 border-t px-4 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Total general
            </span>
            <span className="text-xl font-bold" style={{ color: 'var(--gold)' }}>
              ${totalGeneral.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onDescargarPDF}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              ↓ Descargar PDF
            </button>

            {/* Email */}
            {!emailVisible ? (
              <button
                onClick={() => setEmailVisible(true)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--gold-soft)',
                  borderColor: 'var(--gold-border)',
                  color: 'var(--gold)',
                }}
              >
                ✉ Recibir por email
              </button>
            ) : enviado ? (
              <div
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
                style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)' }}
              >
                ✓ ¡Enviado!
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
                  placeholder="tu@email.com"
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <button
                  onClick={handleEnviar}
                  disabled={enviando || !email.trim()}
                  className="px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--gold)',
                    color: 'var(--bg)',
                    opacity: enviando || !email.trim() ? 0.5 : 1,
                  }}
                >
                  {enviando ? '...' : '→'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
