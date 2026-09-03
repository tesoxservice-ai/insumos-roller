'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CatalogoCompleto, Color, TipoCortina, Tela } from '@/types'
import { useConfigurador } from '@/hooks/useConfigurador'
import { useCart } from '@/context/CartContext'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

const IMAGEN_MAP: Record<string, string> = {
  'roller': '/images/ROLLER.png',
  'vertical': '/images/VERTICALES.png',
  'banda': '/images/VERTICALES.png',
  'tradicional': '/images/TEXTILES.png',
  'textil': '/images/TEXTILES.png',
  'romana': '/images/Romanas.png',
}

function getImagenTipo(nombre: string): string | null {
  const lower = nombre.toLowerCase()
  for (const [key, src] of Object.entries(IMAGEN_MAP)) {
    if (lower.includes(key)) return src
  }
  return null
}

interface Props {
  catalogo: CatalogoCompleto
}

export default function ConfiguradorMobile({ catalogo }: Props) {
  const {
    state, setTipo, setTela, setColor, setColorInterior, setColorExterior,
    setMedidas, setSistema, setInstalacion, setCaida, resetear,
  } = useConfigurador()

  const { agregarItem, abrirDrawer } = useCart()
  const [paso, setPaso] = useState(0)
  const [agregado, setAgregado] = useState(false)

  function irA(n: number) {
    if (n >= 0 && n < PASOS.length) {
      setPaso(n)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleFueraDeRango() {
    const msg = generarMensajeWhatsApp(state, 0)
    const url = generarUrlWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '', msg)
    window.open(url, '_blank')
  }

  function handleAgregarAlCarrito() {
    const descripcion = [
      state.tela?.nombre,
      state.color?.nombre,
      state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : '',
      state.sistema ? `Sistema: ${state.sistema}` : '',
      state.instalacion ? 'Con instalación' : '',
    ].filter(Boolean).join(' · ')

    agregarItem({
      id: `medida-${Date.now()}`,
      nombre: `Cortina ${state.tipo?.nombre ?? 'a medida'}`,
      descripcion,
      precio: 0,
      tipo: 'medida',
      medidaEspecial: false,
    }, false)

    setAgregado(true)
    setTimeout(() => {
      abrirDrawer()
      resetear()
      setPaso(0)
      setAgregado(false)
    }, 1200)
  }

  const coloresFiltrados = catalogo.colores.filter(c => c.tela_id === state.tela?.id)
  const telasFiltradas = catalogo.telas.filter(t => t.tipo_id === state.tipo?.id)

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 64, paddingBottom: 100 }}>

      {/* Stepper */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 10,
        background: '#fff', borderBottom: '1px solid #F0F0F0',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
          Paso {paso + 1} de {PASOS.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {PASOS.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (i < paso) irA(i) }}
              style={{
                width: i === paso ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === paso ? '#14008C' : i < paso ? '#14008C55' : '#E0E0E0',
                border: 'none',
                cursor: i < paso ? 'pointer' : 'default',
                transition: 'all 0.2s',
                padding: 0,
              }}
            />
          ))}
        </div>
        {paso > 0 && (
          <button onClick={() => irA(paso - 1)} style={{
            background: 'none', border: 'none', color: '#14008C',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
          }}>
            ← Atrás
          </button>
        )}
        {paso === 0 && <div style={{ width: 48 }} />}
      </div>

      {/* PASO 0 — Tipo */}
      {paso === 0 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Elegí el tipo de cortina
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            Tocá para seleccionar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catalogo.tipos.map(tipo => {
              const imagen = getImagenTipo(tipo.nombre)
              const seleccionado = state.tipo?.id === tipo.id
              return (
                <button
                  key={tipo.id}
                  onClick={() => { setTipo(tipo); irA(1) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px',
                    background: seleccionado ? '#EEF0FF' : '#FAFAFA',
                    border: `2px solid ${seleccionado ? '#14008C' : '#EBEBEB'}`,
                    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {imagen ? (
                    <div style={{ width: 64, height: 64, flexShrink: 0, position: 'relative' }}>
                      <Image src={imagen} alt={tipo.nombre} fill style={{ objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 10, background: '#E8E0D0', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 4px 0' }}>{tipo.nombre}</p>
                    <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.4 }}>
                      {tipo.descripcion ?? ''}
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={seleccionado ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* PASO 1 — Tela */}
      {paso === 1 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Elegí la tela
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            {state.tipo?.nombre} · Tocá para seleccionar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {telasFiltradas.map(tela => {
              const seleccionada = state.tela?.id === tela.id
              return (
                <button
                  key={tela.id}
                  onClick={() => { setTela(tela); irA(2) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px',
                    background: seleccionada ? '#EEF0FF' : '#FAFAFA',
                    border: `2px solid ${seleccionada ? '#14008C' : '#EBEBEB'}`,
                    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                    background: tela.nombre.toLowerCase().includes('blackout') ? '#2C2C2C' :
                      tela.nombre.toLowerCase().includes('sunscreen') ? '#D4C9B0' :
                      tela.nombre.toLowerCase().includes('doble') ? '#8C8070' : '#E8E0D0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="3" y1="15" x2="21" y2="15"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 4px 0' }}>{tela.nombre}</p>
                    {tela.checks && tela.checks.length > 0 && (
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                        {tela.checks.slice(0, 2).join(' · ')}
                      </p>
                    )}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={seleccionada ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* PASO 2 — Color */}
      {paso === 2 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Elegí el color
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            {state.tela?.nombre} · Tocá para seleccionar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {coloresFiltrados.map(color => {
              const seleccionado = state.color?.id === color.id
              return (
                <button
                  key={color.id}
                  onClick={() => { setColor(color); irA(3) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px',
                    background: seleccionado ? '#EEF0FF' : '#FAFAFA',
                    border: `2px solid ${seleccionado ? '#14008C' : '#EBEBEB'}`,
                    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: color.hex,
                    border: '3px solid rgba(0,0,0,0.08)',
                    flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: 0, flex: 1 }}>
                    {color.nombre}
                  </p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={seleccionado ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>

          {/* Botón siguiente */}
          {state.color && (
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
              <button onClick={() => irA(3)} style={{
                width: '100%', padding: '16px', background: '#14008C',
                border: 'none', borderRadius: 12, color: '#fff',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
              }}>
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PASO 3 — Medidas */}
      {paso === 3 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Ingresá las medidas
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 32 }}>
            En centímetros
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                ANCHO (cm)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={state.ancho || ''}
                  onChange={e => setMedidas(Number(e.target.value), state.alto)}
                  placeholder="Ej: 120"
                  style={{
                    width: '100%', padding: '18px 56px 18px 20px',
                    border: '2px solid #EBEBEB', borderRadius: 12,
                    fontSize: 20, fontWeight: 600, color: '#0A0A14',
                    outline: 'none', boxSizing: 'border-box', background: '#FAFAFA',
                  }}
                  onFocus={e => e.target.style.borderColor = '#14008C'}
                  onBlur={e => e.target.style.borderColor = '#EBEBEB'}
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#999', fontWeight: 600 }}>cm</span>
              </div>
              <p style={{ fontSize: 12, color: '#BBB', margin: '6px 0 0 4px' }}>Mínimo 50 cm · Máximo 300 cm</p>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                ALTO (cm)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={state.alto || ''}
                  onChange={e => setMedidas(state.ancho, Number(e.target.value))}
                  placeholder="Ej: 160"
                  style={{
                    width: '100%', padding: '18px 56px 18px 20px',
                    border: '2px solid #EBEBEB', borderRadius: 12,
                    fontSize: 20, fontWeight: 600, color: '#0A0A14',
                    outline: 'none', boxSizing: 'border-box', background: '#FAFAFA',
                  }}
                  onFocus={e => e.target.style.borderColor = '#14008C'}
                  onBlur={e => e.target.style.borderColor = '#EBEBEB'}
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#999', fontWeight: 600 }}>cm</span>
              </div>
              <p style={{ fontSize: 12, color: '#BBB', margin: '6px 0 0 4px' }}>Mínimo 80 cm · Máximo 350 cm</p>
            </div>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
            {state.ancho > 0 && state.alto > 0 ? (
              <button onClick={() => irA(4)} style={{
                width: '100%', padding: '16px', background: '#14008C',
                border: 'none', borderRadius: 12, color: '#fff',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
              }}>
                Siguiente →
              </button>
            ) : (
              <button disabled style={{
                width: '100%', padding: '16px', background: '#E0E0E0',
                border: 'none', borderRadius: 12, color: '#AAA',
                fontSize: 16, fontWeight: 700, cursor: 'not-allowed',
              }}>
                Ingresá ancho y alto para continuar
              </button>
            )}
          </div>
        </div>
      )}

      {/* PASO 4 — Sistema */}
      {paso === 4 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Sistema y opciones
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 28 }}>
            Personalizá tu cortina
          </p>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', marginBottom: 12 }}>SISTEMA</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Manual', 'Motorizado'].map(sis => {
                const sel = state.sistema === sis
                return (
                  <button key={sis} onClick={() => setSistema(sis, 0)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: sel ? '#EEF0FF' : '#FAFAFA',
                    border: `2px solid ${sel ? '#14008C' : '#EBEBEB'}`,
                    borderRadius: 14, cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: sel ? '#14008C' : '#E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sis === 'Manual' ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? '#fff' : '#888'} strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? '#fff' : '#888'} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                        )}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: 0 }}>{sis}</p>
                        <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0 0' }}>
                          {sis === 'Manual' ? 'Operación con cadena' : 'Motor incluido, control remoto'}
                        </p>
                      </div>
                    </div>
                    {sel && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', marginBottom: 12 }}>INSTALACIÓN</p>
            <button
              onClick={() => setInstalacion(!state.instalacion, 0)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px', width: '100%',
                background: state.instalacion ? '#EEF0FF' : '#FAFAFA',
                border: `2px solid ${state.instalacion ? '#14008C' : '#EBEBEB'}`,
                borderRadius: 14, cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: state.instalacion ? '#14008C' : '#E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={state.instalacion ? '#fff' : '#888'} strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: 0 }}>Instalación profesional</p>
                  <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0 0' }}>Un instalador va a tu domicilio</p>
                </div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: `2px solid ${state.instalacion ? '#14008C' : '#CCC'}`,
                background: state.instalacion ? '#14008C' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {state.instalacion && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </button>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
            <button onClick={() => irA(5)} disabled={!state.sistema} style={{
              width: '100%', padding: '16px',
              background: state.sistema ? '#14008C' : '#E0E0E0',
              border: 'none', borderRadius: 12,
              color: state.sistema ? '#fff' : '#AAA',
              fontSize: 16, fontWeight: 700,
              cursor: state.sistema ? 'pointer' : 'not-allowed',
            }}>
              Ver resumen →
            </button>
          </div>
        </div>
      )}

      {/* PASO 5 — Resumen */}
      {paso === 5 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Resumen de tu cortina
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            Revisá los detalles antes de agregar al carrito
          </p>

          <div style={{ background: '#FAFAFA', borderRadius: 16, border: '1px solid #EBEBEB', overflow: 'hidden', marginBottom: 16 }}>
            {[
              { label: 'Tipo', value: state.tipo?.nombre },
              { label: 'Tela', value: state.tela?.nombre },
              { label: 'Color', value: state.color?.nombre },
              { label: 'Medidas', value: state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : null },
              { label: 'Sistema', value: state.sistema },
              { label: 'Instalación', value: state.instalacion ? 'Sí, instalación profesional' : 'No' },
            ].map((item, i) => item.value && (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < 5 ? '1px solid #F0F0F0' : 'none',
              }}>
                <span style={{ fontSize: 14, color: '#888' }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A14' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#EEF0FF', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{ fontSize: 13, color: '#14008C', margin: 0, lineHeight: 1.5 }}>
              El precio se confirma por WhatsApp. Te cotizamos y coordinamos juntos.
            </p>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleAgregarAlCarrito} disabled={agregado} style={{
              width: '100%', padding: '16px',
              background: agregado ? '#0D7A4E' : '#14008C',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            <button onClick={() => { resetear(); setPaso(0) }} style={{
              background: 'none', border: 'none', color: '#BBB',
              fontSize: 14, cursor: 'pointer', padding: 0,
            }}>
              ↺ Nueva cortina
            </button>
          </div>
        </div>
      )}
    </div>
  )
}