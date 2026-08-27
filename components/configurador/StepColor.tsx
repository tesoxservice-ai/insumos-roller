'use client'

import { useState } from 'react'
import type { Color } from '@/types'

interface StepColorProps {
  colores: Color[]
  coloresFiltrados: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
  tipoNombre: string
  telaNombre: string
  caida: 'detras' | 'delante'
  onCaidaChange: (caida: 'detras' | 'delante') => void
}

export default function StepColor({
  colores,
  coloresFiltrados,
  seleccionado,
  onSelect,
  tipoNombre,
  telaNombre,
  caida,
  onCaidaChange,
}: StepColorProps) {
  const lista = coloresFiltrados.length > 0 ? coloresFiltrados : colores

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#14008C',
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          PASO 3 DE 6
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700, color: '#0A0A14',
          letterSpacing: '-0.02em', margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Color y accesorios
        </h2>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Elegí el color y la caída del rollo para tu cortina.
        </p>
      </div>

      {/* COLORES */}
      <div style={{
        background: '#fff',
        border: '1px solid #EBEBEB',
        borderRadius: 8,
        padding: '24px 28px',
        marginBottom: 16,
      }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          COLOR DE LA TELA
        </p>

        {lista.length === 0 ? (
          <p style={{ fontSize: 13, color: '#BBB' }}>
            No hay colores disponibles para esta tela.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {lista.map(color => {
              const isSelected = seleccionado?.id === color.id
              return (
                <button
                  key={color.id}
                  onClick={() => onSelect(color)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: color.hex,
                    border: isSelected ? '3px solid #14008C' : '2px solid #E0E0E0',
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(20,0,140,0.12)'
                      : '0 1px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.15s',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected ? '#14008C' : '#888',
                    maxWidth: 60,
                    textAlign: 'center',
                    lineHeight: 1.3,
                    transition: 'color 0.15s',
                  }}>
                    {color.nombre}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Preview del color seleccionado */}
        {seleccionado && (
          <div style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: '#F7F7FB',
            borderRadius: 6,
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: seleccionado.hex,
              border: '2px solid #fff',
              boxShadow: '0 0 0 1.5px #DDD',
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A14' }}>
                {seleccionado.nombre}
              </div>
              <div style={{ fontSize: 11, color: '#BBB' }}>
                {seleccionado.hex.toUpperCase()}
              </div>
            </div>
            <div style={{
              marginLeft: 'auto',
              fontSize: 10, fontWeight: 700,
              color: '#0D7A4E',
              background: 'rgba(13,122,78,0.08)',
              border: '1px solid rgba(13,122,78,0.2)',
              borderRadius: 100,
              padding: '3px 10px',
            }}>
              ✓ Seleccionado
            </div>
          </div>
        )}
      </div>

      {/* CAÍDA DEL ROLLO */}
      <div style={{
        background: '#fff',
        border: '1px solid #EBEBEB',
        borderRadius: 8,
        padding: '24px 28px',
      }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: '#14008C',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          CAÍDA DEL ROLLO
        </p>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>
          Define cómo se enrolla la cortina y cómo queda instalada en la ventana.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
        }}
          className="caida-grid"
        >
          {/* Caída por detrás */}
          <div
            onClick={() => onCaidaChange('detras')}
            style={{
              border: `1.5px solid ${caida === 'detras' ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
              padding: '20px 20px 16px',
              cursor: 'pointer',
              background: caida === 'detras' ? '#F7F7FB' : '#fff',
              boxShadow: caida === 'detras' ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
              transition: 'all 0.18s',
            }}
          >
            {/* Ilustración SVG caída por detrás */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <svg viewBox="0 0 120 100" width="120" height="100" fill="none">
                {/* Pared */}
                <rect x="0" y="0" width="120" height="100" fill="#F5F0E8"/>
                {/* Soporte en la pared */}
                <rect x="20" y="18" width="80" height="8" rx="4" fill="#B0A898"/>
                {/* Tubo pegado a la pared */}
                <rect x="24" y="14" width="72" height="10" rx="5" fill="#C8C0B0"/>
                {/* Tela cae por DETRÁS — entre tubo y pared */}
                <rect x="28" y="24" width="8" height="60" rx="2"
                  fill={seleccionado?.hex ?? '#E0D8CC'}
                  opacity="0.95"
                />
                {/* Resto de la tela */}
                <rect x="28" y="24" width="64" height="60" rx="2"
                  fill={seleccionado?.hex ?? '#E0D8CC'}
                  opacity="0.95"
                />
                {/* Barra inferior */}
                <rect x="26" y="82" width="68" height="6" rx="3" fill="#C8C0B0"/>
                {/* Flecha indicando dirección */}
                <text x="60" y="96" textAnchor="middle" fontSize="9" fill="#888">↑ pegada a la pared</text>
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: caida === 'detras' ? '#14008C' : '#0A0A14',
                  marginBottom: 4,
                }}>
                  Caída por detrás
                </div>
                <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.5 }}>
                  El rollo queda pegado a la pared. La tela cae entre el tubo y la pared. Más discreto y minimalista.
                </p>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${caida === 'detras' ? '#14008C' : '#CCC'}`,
                background: caida === 'detras' ? '#14008C' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginLeft: 12, marginTop: 2,
              }}>
                {caida === 'detras' && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                )}
              </div>
            </div>
          </div>

          {/* Caída por delante */}
          <div
            onClick={() => onCaidaChange('delante')}
            style={{
              border: `1.5px solid ${caida === 'delante' ? '#14008C' : '#EBEBEB'}`,
              borderRadius: 8,
              padding: '20px 20px 16px',
              cursor: 'pointer',
              background: caida === 'delante' ? '#F7F7FB' : '#fff',
              boxShadow: caida === 'delante' ? '0 0 0 3px rgba(20,0,140,0.07)' : 'none',
              transition: 'all 0.18s',
            }}
          >
            {/* Ilustración SVG caída por delante */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <svg viewBox="0 0 120 100" width="120" height="100" fill="none">
                {/* Pared */}
                <rect x="0" y="0" width="120" height="100" fill="#F5F0E8"/>
                {/* Soporte en la pared */}
                <rect x="20" y="18" width="80" height="8" rx="4" fill="#B0A898"/>
                {/* Tubo separado de la pared */}
                <rect x="24" y="14" width="72" height="10" rx="5" fill="#C8C0B0"/>
                {/* Tela cae por DELANTE — por el frente del tubo */}
                <rect x="28" y="24" width="64" height="60" rx="2"
                  fill={seleccionado?.hex ?? '#E0D8CC'}
                  opacity="0.95"
                />
                {/* Espacio entre tela y pared */}
                <rect x="28" y="24" width="8" height="60"
                  fill="#F5F0E8"
                  opacity="0.7"
                />
                {/* Barra inferior desplazada hacia adelante */}
                <rect x="26" y="82" width="68" height="6" rx="3" fill="#C8C0B0"/>
                <text x="60" y="96" textAnchor="middle" fontSize="9" fill="#888">↑ separada de la pared</text>
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: caida === 'delante' ? '#14008C' : '#0A0A14',
                  marginBottom: 4,
                }}>
                  Caída por delante
                </div>
                <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.5 }}>
                  El rollo queda separado de la pared. La tela cae por el frente. Más volumen y presencia visual.
                </p>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${caida === 'delante' ? '#14008C' : '#CCC'}`,
                background: caida === 'delante' ? '#14008C' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginLeft: 12, marginTop: 2,
              }}>
                {caida === 'delante' && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .caida-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}