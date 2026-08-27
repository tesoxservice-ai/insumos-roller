'use client'

interface StepHeaderProps {
  pasos: string[]
  pasoActual: number
  onClickPaso: (index: number) => void
}

export default function StepHeader({ pasos, pasoActual, onClickPaso }: StepHeaderProps) {
  return (
    <div style={{
      width: '100%',
      background: '#fff',
      paddingBottom: 8,
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 8px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        overflowX: 'auto',
      }}>
        {pasos.map((paso, i) => {
          const completado = i < pasoActual
          const activo = i === pasoActual
          const clickable = completado
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
              <button
                onClick={() => clickable && onClickPaso(i)}
                disabled={!clickable}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  padding: '6px 0',
                  flexShrink: 0,
                  outline: 'none',
                }}
              >
                {/* Círculo */}
                <div style={{
                  width: 34,
                  height: 34,
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
                    : '2px solid #D0D0D0',
                  transition: 'all 0.2s',
                }}>
                  {completado ? (
                    <svg width="15" height="15" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: activo ? '#fff' : '#BBBBBB',
                      lineHeight: 1,
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <span style={{
                  fontSize: 13,
                  fontWeight: activo ? 700 : completado ? 600 : 500,
                  color: activo
                    ? '#14008C'
                    : completado
                    ? '#0A0A14'
                    : '#C0C0C0',
                  letterSpacing: '0.08em',
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
                  margin: '0 14px',
                  background: completado ? '#0A0A14' : '#E8E8E8',
                  transition: 'background 0.3s',
                  minWidth: 16,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}