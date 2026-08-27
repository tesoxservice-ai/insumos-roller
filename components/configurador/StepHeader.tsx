'use client'

interface StepHeaderProps {
  pasos: string[]
  pasoActual: number
  onClickPaso: (index: number) => void
}

export default function StepHeader({ pasos, pasoActual, onClickPaso }: StepHeaderProps) {
  return (
    <header style={{
      width: '100%',
      background: '#fff',
      borderBottom: '1px solid #EBEBEB',
      position: 'sticky',
      top: 72, // debajo del nav
      zIndex: 30,
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
      }}>
        {pasos.map((paso, i) => {
          const completado = i < pasoActual
          const activo = i === pasoActual
          const clickable = i < pasoActual
          const esUltimo = i === pasos.length - 1

          return (
            <div
              key={paso}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: esUltimo ? '0 0 auto' : '1 1 0',
                minWidth: 0,
              }}
            >
              {/* Paso */}
              <button
                onClick={() => clickable && onClickPaso(i)}
                disabled={!clickable}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  padding: '4px 0',
                  flexShrink: 0,
                }}
              >
                {/* Círculo */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: completado
                    ? '#0A0A14'
                    : activo
                    ? '#14008C'
                    : 'transparent',
                  border: completado || activo
                    ? 'none'
                    : '1.5px solid #CCCCCC',
                  transition: 'all 0.2s',
                }}>
                  {completado ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: activo ? '#fff' : '#AAA',
                      lineHeight: 1,
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <span style={{
                  fontSize: 12,
                  fontWeight: activo || completado ? 700 : 500,
                  color: activo
                    ? '#14008C'
                    : completado
                    ? '#0A0A14'
                    : '#BBBBBB',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}>
                  {paso}
                </span>
              </button>

              {/* Línea conectora */}
              {!esUltimo && (
                <div style={{
                  flex: 1,
                  height: 1.5,
                  margin: '0 12px',
                  background: completado ? '#0A0A14' : '#E0E0E0',
                  transition: 'background 0.2s',
                  minWidth: 16,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </header>
  )
}