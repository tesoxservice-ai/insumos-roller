'use client'

import type { Tela } from '@/types'

interface StepTelaProps {
  telas: Tela[]
  telasFiltradas: Tela[]
  seleccionada: Tela | null
  onSelect: (tela: Tela) => void
}

const EMOJIS: Record<string, string> = {
  Blackout: '🌙',
  Sunscreen: '☀️',
  Doble: '✨',
}

const COLORES_FONDO: Record<string, string> = {
  Blackout: '#2A2520',
  Sunscreen: '#F0EAE0',
  Doble: '#E8E4DC',
}

function getEmoji(nombre: string) {
  for (const key of Object.keys(EMOJIS)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return EMOJIS[key]
  }
  return '✨'
}

function getFondo(nombre: string) {
  for (const key of Object.keys(COLORES_FONDO)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) return COLORES_FONDO[key]
  }
  return '#F0EAE0'
}

export default function StepTela({
  telas,
  telasFiltradas,
  seleccionada,
  onSelect,
}: StepTelaProps) {
  const lista = telasFiltradas.length > 0 ? telasFiltradas : telas

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#14008C',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          PASO 2 DE 6
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700,
          color: '#0A0A14',
          letterSpacing: '-0.02em',
          margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Elegí el tipo de tela
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{
          fontSize: 14, color: '#999', margin: 0,
          maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
          lineHeight: 1.6,
        }}>
          Cada tela tiene propiedades únicas de luz, privacidad y temperatura.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(lista.length, 3)}, 1fr)`,
        gap: 16,
        marginBottom: 24,
      }}
        className="tela-grid"
      >
        {lista.map(tela => {
          const activo = seleccionada?.id === tela.id
          const fondo = getFondo(tela.nombre)
          const esOscuro = tela.nombre.toLowerCase().includes('blackout')

          return (
            <div
              key={tela.id}
              onClick={() => onSelect(tela)}
              style={{
                border: `1.5px solid ${activo ? '#14008C' : '#EBEBEB'}`,
                borderRadius: 6,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.18s',
                background: '#fff',
                boxShadow: activo ? '0 0 0 3px rgba(20,0,140,0.08)' : 'none',
              }}
            >
              {/* Imagen placeholder de textura */}
              <div style={{
                background: fondo,
                height: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Textura simulada con SVG */}
                <svg
                  viewBox="0 0 200 160"
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', inset: 0 }}
                  preserveAspectRatio="xMidYMid slice"
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line
                      key={`h${i}`}
                      x1="0" y1={i * 8} x2="200" y2={i * 8}
                      stroke={esOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                      strokeWidth="1"
                    />
                  ))}
                  {Array.from({ length: 25 }).map((_, i) => (
                    <line
                      key={`v${i}`}
                      x1={i * 8} y1="0" x2={i * 8} y2="160"
                      stroke={esOscuro ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
                      strokeWidth="1"
                    />
                  ))}
                  {/* Pliegues diagonales sutiles */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line
                      key={`d${i}`}
                      x1={i * 40 - 20} y1="0"
                      x2={i * 40 + 20} y2="160"
                      stroke={esOscuro ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                      strokeWidth="3"
                    />
                  ))}
                </svg>

                {/* Emoji centrado */}
                <span style={{
                  fontSize: 36,
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}>
                  {getEmoji(tela.nombre)}
                </span>

                {/* Radio button */}
                <div style={{
                  position: 'absolute',
                  bottom: 12, right: 12,
                  width: 22, height: 22,
                  borderRadius: '50%',
                  border: `2px solid ${activo ? '#14008C' : esOscuro ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}`,
                  background: activo ? '#14008C' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activo && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{
                  fontSize: 13, fontWeight: 800,
                  color: activo ? '#14008C' : '#0A0A14',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                }}>
                  {tela.nombre.toUpperCase()}
                </div>
                <p style={{
                  fontSize: 12, color: '#888',
                  lineHeight: 1.55, margin: '0 0 12px 0',
                }}>
                  {tela.descripcion}
                </p>

                {/* Checks */}
                {tela.checks && tela.checks.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {tela.checks.map((check, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 7,
                        fontSize: 12, color: '#555',
                      }}>
                        <span style={{ color: '#0D7A4E', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 0 }}>✓</span>
                        {check}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Placeholder simulador de luz */}
      <div style={{
        background: '#F7F7FB',
        border: '1px dashed #C8C8DC',
        borderRadius: 6,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 0,
      }}>
        <div style={{
          width: 40, height: 40,
          background: '#EEEEF8',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          💡
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A14', marginBottom: 2 }}>
            Simulador de luz
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            Próximamente podrás ver cuánta luz entra con cada tipo de tela.
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontSize: 10, fontWeight: 700,
          color: '#14008C',
          background: 'rgba(20,0,140,0.07)',
          border: '1px solid rgba(20,0,140,0.18)',
          borderRadius: 100,
          padding: '3px 10px',
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          PRÓXIMAMENTE
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .tela-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}