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
      top: 72,
      zIndex: 30,
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 32px',
        height: 52,
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
                  gap: 7,
                  background: 'none',
                  border: 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  padding: '4px 0',
                  flexShrink: 0,
                  outline: 'none',
                }}
              >
                {/* Número / check */}
                <div style={{
                  width: 22,
                  height: 22,
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
                    : '1.5px solid #D0D0D0',
                  transition: 'all 0.2s',
                }}>
                  {completado ? (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 10,
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
                  fontSize: 11,
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
                  height: 1,
                  margin: '0 10px',
                  background: completado ? '#0A0A14' : '#E8E8E8',
                  transition: 'background 0.3s',
                  minWidth: 12,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </header>
  )
}