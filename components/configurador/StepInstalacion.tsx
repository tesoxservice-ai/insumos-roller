'use client'

interface StepInstalacionProps {
  instalacion: boolean
  onChange: (activa: boolean, extra: number) => void
  instExtra?: number
}

function RadioCircle({ activo }: { activo: boolean }) {
  return (
    <div style={{
      width: 22, height: 22,
      borderRadius: '50%',
      border: `2px solid ${activo ? '#14008C' : '#CCC'}`,
      background: activo ? '#14008C' : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.15s',
    }}>
      {activo && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
    </div>
  )
}

export default function StepInstalacion({
  instalacion,
  onChange,
  instExtra = 20000,
}: StepInstalacionProps) {
  return (
    <div>
      <p style={{
        fontSize: 12, fontWeight: 800, color: '#14008C',
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16,
      }}>
        Instalación
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        className="inst-standalone-grid"
      >
        {/* La instalo yo */}
        <div
          onClick={() => onChange(false, 0)}
          style={{
            border: `1.5px solid ${!instalacion ? '#14008C' : '#EBEBEB'}`,
            borderRadius: 10,
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            transition: 'all 0.18s',
            background: '#fff',
            boxShadow: !instalacion ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
          }}
        >
          <div style={{
            width: 140, flexShrink: 0,
            background: '#F5F0E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, fontSize: 44,
          }}>
            📦
          </div>
          <div style={{ padding: '20px 18px', flex: 1, position: 'relative' }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>🔩</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A14', marginBottom: 8 }}>
              La instalo yo
            </div>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, margin: 0 }}>
              Te enviamos la cortina con instrucciones claras. La mayoría de las personas la instala en menos de 30 minutos.
            </p>
            <div style={{ position: 'absolute', bottom: 18, right: 18 }}>
              <RadioCircle activo={!instalacion} />
            </div>
          </div>
        </div>

        {/* Instalación profesional */}
        <div
          onClick={() => onChange(true, instExtra)}
          style={{
            border: `1.5px solid ${instalacion ? '#14008C' : '#EBEBEB'}`,
            borderRadius: 10,
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            transition: 'all 0.18s',
            background: '#fff',
            boxShadow: instalacion ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
          }}
        >
          <div style={{
            width: 140, flexShrink: 0,
            background: '#F5F0E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, fontSize: 44,
          }}>
            👷
          </div>
          <div style={{ padding: '20px 18px', flex: 1, position: 'relative' }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>🏠</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: instalacion ? '#14008C' : '#0A0A14', marginBottom: 8 }}>
              Quiero instalación profesional
            </div>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, margin: '0 0 10px 0' }}>
              Nuestro equipo instala la cortina en tu domicilio. Incluye medición final, colocación y prueba del sistema.
            </p>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#14008C' }}>
              + ${instExtra.toLocaleString('es-AR')}
            </div>
            <div style={{ position: 'absolute', bottom: 18, right: 18 }}>
              <RadioCircle activo={instalacion} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .inst-standalone-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}