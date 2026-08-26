'use client'

import type { ReglaPrecio } from '@/types'

interface StepSistemaProps {
  sistema: string
  instalacion: boolean
  onSistemaChange: (sistema: 'manual' | 'motorizado', extra: number) => void
  onInstalacionChange: (activa: boolean, extra: number) => void
  regla: ReglaPrecio | null
}

interface OpcionCardProps {
  seleccionada: boolean
  onClick: () => void
  icono: React.ReactNode
  titulo: string
  descripcion: string
  extra: string | null
}

function OpcionCard({ seleccionada, onClick, icono, titulo, descripcion, extra }: OpcionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-xl border text-left w-full transition-all"
      style={{
        backgroundColor: seleccionada ? 'var(--gold-soft)' : 'var(--surface)',
        borderColor: seleccionada ? 'var(--gold)' : 'var(--border)',
        borderWidth: seleccionada ? '2px' : '1px',
      }}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{icono}</span>
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: seleccionada ? 'var(--gold)' : 'var(--text)' }}>
          {titulo}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {descripcion}
        </p>
        {extra && (
          <p className="text-xs font-semibold mt-1" style={{ color: 'var(--gold)' }}>
            {extra}
          </p>
        )}
      </div>
      {/* Indicador selección */}
      <span
        className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1"
        style={{
          borderColor: seleccionada ? 'var(--gold)' : 'var(--border)',
          backgroundColor: seleccionada ? 'var(--gold)' : 'transparent',
        }}
      />
    </button>
  )
}

export default function StepSistema({
  sistema,
  instalacion,
  onSistemaChange,
  onInstalacionChange,
  regla,
}: StepSistemaProps) {
  const motorizadoExtra = regla?.motorizada_extra ?? 0
  const instalacionExtra = regla?.instalacion_extra ?? 0

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Sistema e instalación
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Elegí cómo vas a manejar tu cortina y si necesitás que la instalemos.
      </p>

      {/* Sistema de accionamiento */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Sistema de accionamiento
        </h3>
        <div className="flex flex-col gap-3">
          <OpcionCard
            seleccionada={sistema === 'manual'}
            onClick={() => onSistemaChange('manual', 0)}
            icono="🔗"
            titulo="Cadena manual"
            descripcion="Sistema clásico con cadena plástica o metálica. Simple, silencioso y sin necesidad de electricidad."
            extra={null}
          />
          <OpcionCard
            seleccionada={sistema === 'motorizado'}
            onClick={() => onSistemaChange('motorizado', motorizadoExtra)}
            icono="⚡"
            titulo="Motorizado"
            descripcion="Motor silencioso controlable por control remoto o app. Ideal para cortinas de difícil acceso o grandes dimensiones."
            extra={motorizadoExtra > 0 ? `+ $${motorizadoExtra.toLocaleString('es-AR')}` : null}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="my-6" style={{ borderTop: '1px solid var(--border)' }} />

      {/* Instalación */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Instalación
        </h3>
        <div className="flex flex-col gap-3">
          <OpcionCard
            seleccionada={!instalacion}
            onClick={() => onInstalacionChange(false, 0)}
            icono="🔨"
            titulo="La instalo yo"
            descripcion="Te enviamos la cortina con instrucciones claras. La mayoría de las personas la instala en menos de 30 minutos."
            extra={null}
          />
          <OpcionCard
            seleccionada={instalacion}
            onClick={() => onInstalacionChange(true, instalacionExtra)}
            icono="👷"
            titulo="Quiero instalación profesional"
            descripcion="Nuestro equipo instala la cortina en tu domicilio. Incluye medición final, colocación y prueba del sistema."
            extra={instalacionExtra > 0 ? `+ $${instalacionExtra.toLocaleString('es-AR')}` : null}
          />
        </div>
      </section>
    </div>
  )
}
