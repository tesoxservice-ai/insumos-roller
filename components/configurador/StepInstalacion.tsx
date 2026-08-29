'use client'

import Image from 'next/image'

interface StepInstalacionProps {
  instalacion: boolean
  onChange: (activa: boolean, extra: number) => void
  instExtra?: number
}

const OPCIONES = [
  {
    key: false,
    img: '/images/instalacion-yo.png',
    titulo: 'La instalo yo',
    desc: 'Recibís todo listo con instrucciones claras. La mayoría lo instala en menos de 30 minutos.',
    precio: null,
  },
  {
    key: true,
    img: '/images/instalacion-profesional.png',
    titulo: 'Instalación profesional',
    desc: 'Nuestro equipo instala en tu domicilio. Incluye medición final, colocación y prueba.',
    precio: 'extra',
  },
]

export default function StepInstalacion({
  instalacion,
  onChange,
  instExtra = 20000,
}: StepInstalacionProps) {
  return (
    <div>
      <p style={{
        fontSize: 12, fontWeight: 800, color: '#14008C',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        marginBottom: 16, textAlign: 'center',
      }}>
        Instalación
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 380px))',
        gap: 16, justifyContent: 'center',
      }}
        className="inst-standalone-grid"
      >
        {OPCIONES.map(op => {
          const activo = instalacion === op.key
          return (
            <div
              key={String(op.key)}
              onClick={() => onChange(op.key, op.key ? instExtra : 0)}
              style={{
                border: '1px solid #EBEBEB',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                transition: 'box-shadow 0.18s',
              }}
            >
              {/* Imagen */}
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '3/4',
                background: '#F5F3EF',
                border: activo ? '2px solid #14008C' : '2px solid transparent',
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border 0.18s',
              }}>
                <Image
                  src={op.img}
                  alt={op.titulo}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="380px"
                />
                {/* Radio overlay */}
                <div style={{
                  position: 'absolute', bottom: 14, right: 14,
                  width: 26, height: 26, borderRadius: '50%',
                  border: `2px solid ${activo ? '#14008C' : 'rgba(255,255,255,0.8)'}`,
                  background: activo ? '#14008C' : 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'all 0.15s',
                }}>
                  {activo && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>

              {/* Info debajo */}
              <div style={{ padding: '16px 18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700,
                    color: activo ? '#14008C' : '#0A0A14',
                    transition: 'color 0.15s',
                  }}>
                    {op.titulo}
                  </span>
                  {op.precio === 'extra' && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#14008C' }}>
                      + ${instExtra.toLocaleString('es-AR')}
                    </span>
                  )}
                  {op.precio === null && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0D7A4E' }}>
                      Sin costo adicional
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>
                  {op.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .inst-standalone-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}