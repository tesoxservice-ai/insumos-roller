'use client'

import { useState } from 'react'
import type { ConfiguradorState, ReglaPrecio } from '@/types'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'

interface StepCierreProps {
  state: ConfiguradorState
  precioEstimado: number | null
  reglas: ReglaPrecio[]
  onAgregarAlPresupuesto: (ambiente: string) => void
  onNuevoProducto: () => void
}

interface FilaResumenProps {
  label: string
  valor: string
}

function FilaResumen({ label, valor }: FilaResumenProps) {
  return (
    <div
      className="flex justify-between items-center py-2.5 border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{valor}</span>
    </div>
  )
}

export default function StepCierre({
  state,
  precioEstimado,
  onAgregarAlPresupuesto,
  onNuevoProducto,
}: StepCierreProps) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ambiente, setAmbiente] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  const handleWhatsApp = () => {
    if (precioEstimado === null) return
    const mensaje = generarMensajeWhatsApp(state, precioEstimado)
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
    const url = generarUrlWhatsApp(numero, mensaje)
    window.open(url, '_blank')
  }

  const handleConfirmarAmbiente = () => {
    if (!ambiente.trim()) return
    onAgregarAlPresupuesto(ambiente.trim())
    setConfirmado(true)
    setTimeout(() => {
      setModalAbierto(false)
      setAmbiente('')
      setConfirmado(false)
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Resumen de tu cortina
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Revisá los detalles antes de continuar.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Resumen izquierda */}
        <div
          className="flex-1 rounded-xl border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--gold)' }}>
            ✦ Configuración
          </h3>

          <FilaResumen label="Tipo" valor={state.tipo?.nombre ?? '—'} />
          <FilaResumen label="Tela" valor={state.tela?.nombre ?? '—'} />
          <FilaResumen label="Color" valor={state.color?.nombre ?? '—'} />
          <FilaResumen
            label="Medidas"
            valor={state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : '—'}
          />
          <FilaResumen
            label="Sistema"
            valor={
              state.sistema === 'motorizado'
                ? `Motorizado (+$${state.sistemaExtra.toLocaleString('es-AR')})`
                : state.sistema === 'manual'
                ? 'Cadena manual'
                : '—'
            }
          />
          <FilaResumen
            label="Instalación"
            valor={
              state.instalacion
                ? `Profesional (+$${state.instExtra.toLocaleString('es-AR')})`
                : 'Sin instalación'
            }
          />
          <FilaResumen label="Plazo estimado" valor="15 días hábiles" />

          {/* Total */}
          <div className="mt-4 pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Total estimado
            </span>
            <span className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>
              {precioEstimado !== null
                ? `$${precioEstimado.toLocaleString('es-AR')}`
                : '—'}
            </span>
          </div>
        </div>

        {/* Acciones derecha */}
        <div className="flex flex-col gap-3 lg:w-72">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 p-4 rounded-xl border font-semibold transition-all hover:opacity-90 w-full"
            style={{
              backgroundColor: '#22543d',
              borderColor: '#38a169',
              color: '#f0fff4',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar por WhatsApp
          </button>

          {/* Agregar al presupuesto */}
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-3 p-4 rounded-xl border font-semibold transition-all hover:opacity-90 w-full"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--gold-border)',
              color: 'var(--text)',
            }}
          >
            <span style={{ color: 'var(--gold)' }}>＋</span>
            Agregar al presupuesto
          </button>

          {/* Nuevo producto */}
          <button
            onClick={onNuevoProducto}
            className="text-sm text-center py-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            ↩ Configurar otra cortina
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            El precio es orientativo y puede variar según disponibilidad.
          </p>
        </div>
      </div>

      {/* Modal ambiente */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {confirmado ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <span className="text-3xl">✅</span>
                <p className="font-semibold" style={{ color: 'var(--green)' }}>
                  ¡Ambiente agregado!
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  ¿Cómo se llama el ambiente?
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Ej: Dormitorio principal, Living, Cocina
                </p>
                <input
                  type="text"
                  value={ambiente}
                  onChange={(e) => setAmbiente(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmarAmbiente()}
                  placeholder="Nombre del ambiente"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border mb-4 outline-none text-sm"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarAmbiente}
                    disabled={!ambiente.trim()}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      backgroundColor: 'var(--gold)',
                      color: 'var(--bg)',
                      opacity: ambiente.trim() ? 1 : 0.4,
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
