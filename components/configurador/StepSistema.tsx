'use client'

import { useState } from 'react'
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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <StepHeader pasos={PASOS} pasoActual={pasoActual} onClickPaso={onClickPaso} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 700, color: '#0A0A14',
            letterSpacing: '-0.02em', margin: '0 0 12px 0',
            fontStyle: 'italic',
          }}>
            Elegí el sistema e instalación
          </h2>
          <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
          <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.6 }}>
            Elegí cómo vas a manejar tu cortina y si necesitás que la instalemos.
          </p>
        </div>
      </div>

      {/* SISTEMA */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.16em', marginBottom: 14,
        }}>
          SISTEMA DE ACCIONAMIENTO
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
          className="sistema-grid"
        >
          {/* Cadena */}
          <div
            onClick={() => onSistemaChange('manual', 0)}
            style={{
              border: `1.5px solid ${sistema === 'manual' || sistema === 'Cadena' ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              transition: 'all 0.18s',
              background: '#fff',
              boxShadow: sistema === 'manual' || sistema === 'Cadena' ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
            }}
          >
            {/* Imagen placeholder */}
            <div style={{
              width: 140, flexShrink: 0,
              background: '#F5F0E8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
            }}>
              <svg viewBox="0 0 80 100" width="80" height="100" fill="none">
                <rect x="10" y="8" width="60" height="8" rx="4" fill="#C8C0B0"/>
                <rect x="14" y="16" width="52" height="68" rx="2" fill="#E8E0D0"/>
                {[28, 40, 52, 64, 76].map(y => (
                  <line key={y} x1="14" y1={y} x2="66" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
                ))}
                <rect x="14" y="82" width="52" height="6" rx="2" fill="#C8C0B0"/>
                <line x1="56" y1="16" x2="56" y2="82" stroke="#C8C0B0" strokeWidth="1.5"/>
                <circle cx="56" cy="88" r="3" fill="#C8C0B0"/>
                {[92, 96, 100].map(y => (
                  <circle key={y} cx="56" cy={y} r="1.5" fill="#C8C0B0"/>
                ))}
              </svg>
            </div>
            {/* Info */}
            <div style={{ padding: '20px 16px 20px 16px', flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>🔗</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', marginBottom: 6 }}>
                Cadena manual
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.55, margin: 0 }}>
                Sistema clásico con cadena plástica o metálica. Simple, silencioso y sin necesidad de electricidad.
              </p>
              <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <RadioCircle activo={sistema === 'manual' || sistema === 'Cadena'} />
              </div>
            </div>
          </div>

          {/* Motorizado */}
          <div
            onClick={() => onSistemaChange('motorizado', motorExtra)}
            style={{
              border: `1.5px solid ${sistema === 'motorizado' || sistema === 'Motorizada' ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              transition: 'all 0.18s',
              background: '#fff',
              boxShadow: sistema === 'motorizado' || sistema === 'Motorizada' ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
            }}
          >
            {/* Imagen placeholder */}
            <div style={{
              width: 140, flexShrink: 0,
              background: '#F5F0E8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
            }}>
              <svg viewBox="0 0 80 100" width="80" height="100" fill="none">
                <rect x="10" y="8" width="60" height="10" rx="5" fill="#B0A898"/>
                <rect x="28" y="6" width="24" height="6" rx="3" fill="#8A8278"/>
                <rect x="14" y="18" width="52" height="68" rx="2" fill="#E8E0D0"/>
                {[30, 42, 54, 66, 78].map(y => (
                  <line key={y} x1="14" y1={y} x2="66" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
                ))}
                <rect x="14" y="84" width="52" height="6" rx="2" fill="#C8C0B0"/>
              </svg>
            </div>
            {/* Info */}
            <div style={{ padding: '20px 16px 20px 16px', flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>⚡</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', marginBottom: 6 }}>
                Motorizado
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.55, margin: '0 0 8px 0' }}>
                Motor silencioso controlable por control remoto o app. Ideal para cortinas de difícil acceso o grandes dimensiones.
              </p>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#14008C' }}>
                + ${motorExtra.toLocaleString('es-AR')}
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <RadioCircle activo={sistema === 'motorizado' || sistema === 'Motorizada'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INSTALACIÓN */}
      <div>
        <p style={{
          fontSize: 11, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.16em', marginBottom: 14,
        }}>
          INSTALACIÓN
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
          className="inst-grid"
        >
          {/* La instalo yo */}
          <div
            onClick={() => onInstalacionChange(false, 0)}
            style={{
              border: `1.5px solid ${!instalacion ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
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
              padding: 16, fontSize: 40,
            }}>
              📦
            </div>
            <div style={{ padding: '20px 16px', flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>🔩</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', marginBottom: 6 }}>
                La instalo yo
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.55, margin: 0 }}>
                Te enviamos la cortina con instrucciones claras. La mayoría de las personas la instala en menos de 30 minutos.
              </p>
              <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <RadioCircle activo={!instalacion} />
              </div>
            </div>
          </div>

          {/* Instalación profesional */}
          <div
            onClick={() => onInstalacionChange(true, instExtra)}
            style={{
              border: `1.5px solid ${instalacion ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
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
              padding: 16, fontSize: 40,
            }}>
              👷
            </div>
            <div style={{ padding: '20px 16px', flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>🏠</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: instalacion ? '#14008C' : '#0A0A14', marginBottom: 6 }}>
                Quiero instalación profesional
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.55, margin: '0 0 8px 0' }}>
                Nuestro equipo instala la cortina en tu domicilio. Incluye medición final, colocación y prueba del sistema.
              </p>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#14008C' }}>
                + ${instExtra.toLocaleString('es-AR')}
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <RadioCircle activo={instalacion} />
              </div>
            </div>
          </div>
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