'use client'

interface StepHeaderProps {
  pasos: string[]
  pasoActual: number
  onClickPaso: (index: number) => void
}

export default function StepHeader({ pasos, pasoActual, onClickPaso }: StepHeaderProps) {
  return (
    <header
      className="w-full overflow-x-auto border-b flex-shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        height: '52px',
      }}
    >
      <div className="flex items-center h-full px-4 gap-1 min-w-max">
        {pasos.map((paso, i) => {
          const completado = i < pasoActual
          const activo = i === pasoActual
          const clickable = i < pasoActual

          return (
            <button
              key={paso}
              onClick={() => clickable && onClickPaso(i)}
              disabled={!clickable}
              className="flex items-center gap-2 px-3 py-1 rounded-lg transition-all"
              style={{
                cursor: clickable ? 'pointer' : 'default',
                opacity: !activo && !completado ? 0.45 : 1,
              }}
            >
              {/* Número / check */}
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: completado
                    ? 'var(--green)'
                    : activo
                    ? 'var(--gold)'
                    : 'var(--surface2)',
                  color: completado || activo ? 'var(--bg)' : 'var(--text-muted)',
                }}
              >
                {completado ? '✓' : i + 1}
              </span>

              {/* Nombre */}
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{
                  color: activo
                    ? 'var(--gold)'
                    : completado
                    ? 'var(--text)'
                    : 'var(--text-muted)',
                }}
              >
                {paso}
              </span>

              {/* Separador */}
              {i < pasos.length - 1 && (
                <span className="ml-1 text-xs" style={{ color: 'var(--border)' }}>
                  /
                </span>
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}
