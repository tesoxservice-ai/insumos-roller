'use client'

import Image from 'next/image'
import type { ReglaPrecio } from '@/types'
import StepHeader from '@/components/configurador/StepHeader'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

interface StepSistemaProps {
  sistema: string
  instalacion: boolean
  onSistemaChange: (sistema: 'manual' | 'motorizado', extra: number) => void
  onInstalacionChange: (activa: boolean, extra: number) => void
  regla: ReglaPrecio | null
  pasoActual: number
  onClickPaso: (i: number) => void
}

function RadioCircle({ activo }: { activo: boolean }) {
  return (
    <div style={{
      width: 26, height: 26,
      borderRadius: '50%',
      border: `2px solid ${activo ? '#14008C' : 'rgba(255,255,255,0.8)'}`,
      background: activo ? '#14008C' : 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.15s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }}>
      {activo && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} />}
    </div>
  )
}

function Card({
  src,
  alt,
  activo,
  onClick,
  titulo,
  desc,
  precio,
}: {
  src: string
  alt: string
  activo: boolean
  onClick: () => void
  titulo: string
  desc: string
  precio?: string | null
}) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #EBEBEB',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.18s',
      }}
    >
      {/* Imagen */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        background: '#F5F3EF',
        border: activo ? '2.5px solid #14008C' : '2.5px solid transparent',
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'border 0.18s',
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          sizes="380px"
        />
        <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <RadioCircle activo={activo} />
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
            {titulo}
          </span>
          {precio ? (
            <span style={{ fontSize: 13, fontWeight: 700, color: '#14008C', flexShrink: 0, marginLeft: 8 }}>
              {precio}
            </span>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0D7A4E', flexShrink: 0, marginLeft: 8 }}>
              Sin costo adicional
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function StepSistema({
  sistema,
  instalacion,
  onSistemaChange,
  onInstalacionChange,
  regla,
  pasoActual,
  onClickPaso,
}: StepSistemaProps) {

  const motorExtra = regla?.motorizada_extra ?? 35000
  const instExtra = regla?.instalacion_extra ?? 20000

  const sistemaManual = sistema === 'manual' || sistema === 'Cadena'
  const sistemaMotor  = sistema === 'motorizado' || sistema === 'Motorizada'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <StepHeader pasos={PASOS} pasoActual={pasoActual} onClickPaso={onClickPaso} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 700,
            color: '#0A0A14',
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
          }}>
            Sistema e instalación
          </h2>
          <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 20px' }} />
          <p style={{
            fontSize: 17,
            color: '#444',
            margin: 0,
            maxWidth: 440,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}>
            Elegí cómo vas a manejar tu cortina y si necesitás que la instalemos.
          </p>
        </div>
      </div>

      {/* SISTEMA */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16,
          textAlign: 'center',
        }}>
          Sistema de accionamiento
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 380px))', gap: 16, justifyContent: 'center' }}
          className="sistema-grid"
        >
          <Card
            src="/images/sistema-manual.png"
            alt="Cadena manual"
            activo={sistemaManual}
            onClick={() => onSistemaChange('manual', 0)}
            titulo="Cadena manual"
            desc="Sistema clásico con cadena. Simple, silencioso y sin necesidad de electricidad."
            precio={null}
          />
          <Card
            src="/images/sistema-motorizado.png"
            alt="Motorizado"
            activo={sistemaMotor}
            onClick={() => onSistemaChange('motorizado', motorExtra)}
            titulo="Motorizado"
            desc="Motor silencioso controlable por control remoto o app. Ideal para cortinas de difícil acceso."
            precio={`+ $${motorExtra.toLocaleString('es-AR')}`}
          />
        </div>
      </div>

      {/* INSTALACIÓN */}
      <div>
        <p style={{
          fontSize: 12, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16,
          textAlign: 'center',
        }}>
          Instalación
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 380px))', gap: 16, justifyContent: 'center' }}
          className="inst-grid"
        >
          <Card
            src="/images/instalacion-yo.png"
            alt="La instalo yo"
            activo={!instalacion}
            onClick={() => onInstalacionChange(false, 0)}
            titulo="La instalo yo"
            desc="Recibís todo listo con instrucciones claras. La mayoría lo instala en menos de 30 minutos."
            precio={null}
          />
          <Card
            src="/images/instalacion-profesional.png"
            alt="Instalación profesional"
            activo={instalacion}
            onClick={() => onInstalacionChange(true, instExtra)}
            titulo="Instalación profesional"
            desc="Nuestro equipo instala en tu domicilio. Incluye medición final, colocación y prueba."
            precio={`+ $${instExtra.toLocaleString('es-AR')}`}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .sistema-grid, .inst-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}