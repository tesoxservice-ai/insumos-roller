'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CatalogoCompleto, Color } from '@/types'
import { useConfigurador } from '@/hooks/useConfigurador'
import { useCart } from '@/context/CartContext'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

const IMAGEN_TIPO: Record<string, string> = {
  'roller':      '/images/ROLLER.png',
  'vertical':    '/images/VERTICALES.png',
  'banda':       '/images/VERTICALES.png',
  'tradicional': '/images/TEXTILES.png',
  'textil':      '/images/TEXTILES.png',
  'romana':      '/images/Romanas.png',
}

const IMAGEN_TELA: Record<string, string> = {
  'blackout':  '/images/blackout.png',
  'sunscreen': '/images/sunscreen.png',
  'doble':     '/images/duo.png',
  'duo':       '/images/duo.png',
  'dúo':       '/images/duo.png',
}

function getImagen(nombre: string, map: Record<string, string>): string | null {
  const lower = nombre.toLowerCase()
  for (const [key, src] of Object.entries(map)) {
    if (lower.includes(key)) return src
  }
  return null
}

interface Props { catalogo: CatalogoCompleto }

export default function ConfiguradorMobile({ catalogo }: Props) {
  const {
    state, setTipo, setTela, setColor,
    setMedidas, setSistema, setInstalacion, resetear,
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

  const [tipoSeleccionado, setTipoSeleccionado] = useState(state.tipo)

  function handleSelectTipo(tipo: any) {
    setTipo(tipo)
    setTipoSeleccionado(tipo)
    irA(1)
  }

  const coloresFiltrados = catalogo.colores.filter(c => c.tela_id === state.tela?.id)
  const telasFiltradas = catalogo.telas

  // Estilos reutilizables
  const cardBtn = (seleccionado: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '16px 20px', width: '100%',
    background: seleccionado ? '#EEF0FF' : '#FAFAFA',
    border: `2px solid ${seleccionado ? '#14008C' : '#EBEBEB'}`,
    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.15s',
  })

  const btnSiguiente = (disabled = false): React.CSSProperties => ({
    width: '100%', padding: '16px',
    background: disabled ? '#E0E0E0' : '#14008C',
    border: 'none', borderRadius: 12,
    color: disabled ? '#AAA' : '#fff',
    fontSize: 16, fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
  })

  const barraFija: React.CSSProperties = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    padding: '16px 20px 24px',
    background: '#fff',
    borderTop: '1px solid #F0F0F0',
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 64, paddingBottom: 120 }}>

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
            <button key={i} onClick={() => { if (i < paso) irA(i) }} style={{
              width: i === paso ? 24 : 8, height: 8, borderRadius: 4, padding: 0,
              background: i === paso ? '#14008C' : i < paso ? 'rgba(20,0,140,0.35)' : '#E0E0E0',
              border: 'none', cursor: i < paso ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>
        {paso > 0 ? (
          <button onClick={() => irA(paso - 1)} style={{
            background: 'none', border: 'none', color: '#14008C',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
          }}>← Atrás</button>
        ) : <div style={{ width: 52 }} />}
      </div>

      {/* ── PASO 0 — Tipo ── */}
      {paso === 0 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Elegí el tipo de cortina
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>Tocá para seleccionar</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catalogo.tipos.map(tipo => {
              const imagen = getImagen(tipo.nombre, IMAGEN_TIPO)
              const sel = state.tipo?.id === tipo.id
              return (
                <button key={tipo.id} onClick={() => handleSelectTipo(tipo)} style={cardBtn(sel)}>
                  <div style={{ width: 96, height: 96, position: 'relative', flexShrink: 0 }}>
                    {imagen
                      ? <Image src={imagen} alt={tipo.nombre} fill style={{ objectFit: 'contain' }} />
                      : <div style={{ width: 96, height: 96, borderRadius: 10, background: '#E8E0D0' }} />
                    }
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 3px 0' }}>{tipo.nombre}</p>
                    <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.4 }}>{tipo.descripcion ?? ''}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={sel ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── PASO 1 — Tela ── */}
      {paso === 1 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Elegí la tela
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            {state.tipo?.nombre} · Tocá para seleccionar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {telasFiltradas.map(tela => {
              const imagen = getImagen(tela.nombre, IMAGEN_TELA)
              const sel = state.tela?.id === tela.id
              const esOscuro = tela.nombre.toLowerCase().includes('blackout')
              return (
                <button key={tela.id} onClick={() => { setTela(tela); irA(2) }} style={cardBtn(sel)}>
                  <div style={{
                    width: 96, height: 96, borderRadius: 12, flexShrink: 0,
                    overflow: 'hidden', position: 'relative',
                    background: esOscuro ? '#2A2520' : '#F0EAE0',
                  }}>
                    {imagen && <Image src={imagen} alt={tela.nombre} fill style={{ objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 3px 0' }}>{tela.nombre}</p>
                    {tela.checks && tela.checks.length > 0 && (
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                        {tela.checks.slice(0, 2).join(' · ')}
                      </p>
                    )}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={sel ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>

          {/* Banner simulador de luz */}
          <Link href="/simulador" target="_blank" style={{ textDecoration: 'none', display: 'block', marginTop: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F7F7FB', border: '1px solid #E8E8F0',
              borderRadius: 12, padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEEEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A0A14', margin: '0 0 2px 0' }}>¿No sabés cuál elegir?</p>
                  <p style={{ fontSize: 12, color: '#8888A8', margin: 0 }}>Probá el simulador de luz</p>
                </div>
              </div>
              <span style={{ color: '#14008C', fontWeight: 700, fontSize: 16 }}>→</span>
            </div>
          </Link>
        </div>
      )}

      {/* ── PASO 2 — Color ── */}
      {paso === 2 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Elegí el color
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>
            {state.tela?.nombre} · Tocá para seleccionar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {coloresFiltrados.map(color => {
              const sel = state.color?.id === color.id
              return (
                <button key={color.id} onClick={() => { setColor(color); irA(3) }} style={cardBtn(sel)}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: color.hex, border: '3px solid rgba(0,0,0,0.08)', flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: 0, flex: 1, textAlign: 'left' }}>
                    {color.nombre}
                  </p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={sel ? '#14008C' : '#CCC'} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )
            })}
          </div>
          {state.color && (
            <div style={barraFija}>
              <button onClick={() => irA(3)} style={btnSiguiente()}>Siguiente →</button>
            </div>
          )}
        </div>
      )}

      {/* ── PASO 3 — Medidas ── */}
      {paso === 3 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Ingresá las medidas
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 32 }}>En centímetros</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'ANCHO (cm)', value: state.ancho, onChange: (v: number) => setMedidas(v, state.alto), hint: 'Mínimo 50 cm · Máximo 300 cm' },
              { label: 'ALTO (cm)', value: state.alto, onChange: (v: number) => setMedidas(state.ancho, v), hint: 'Mínimo 80 cm · Máximo 350 cm' },
            ].map(({ label, value, onChange, hint }) => (
              <div key={label}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number" inputMode="numeric"
                    value={value || ''}
                    onChange={e => onChange(Number(e.target.value))}
                    placeholder="0"
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
                <p style={{ fontSize: 12, color: '#BBB', margin: '6px 0 0 4px' }}>{hint}</p>
              </div>
            ))}
          </div>
          <div style={barraFija}>
            <button onClick={() => irA(4)} disabled={!state.ancho || !state.alto} style={btnSiguiente(!state.ancho || !state.alto)}>
              {state.ancho && state.alto ? 'Siguiente →' : 'Ingresá ancho y alto para continuar'}
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 4 — Sistema ── */}
      {paso === 4 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Sistema y opciones
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 28 }}>Personalizá tu cortina</p>

          {/* Sistema */}
          <p style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', marginBottom: 12 }}>SISTEMA</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {[
              { key: 'manual' as const, label: 'Manual', desc: 'Operación con cadena', img: '/images/sistema-manual.png' },
              { key: 'motorizado' as const, label: 'Motorizado', desc: 'Motor incluido, control remoto', img: '/images/sistema-motorizado.png' },
            ].map(({ key, label, desc, img }) => {
              const sel = state.sistema === key
              return (
                <button key={key} onClick={() => setSistema(key, 0)} style={cardBtn(sel)}>
                  <div style={{ width: 96, height: 96, position: 'relative', flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#F5F3EF' }}>
                    <Image src={img} alt={label} fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 3px 0' }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{desc}</p>
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

          {/* Instalación */}
          <p style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: '0.08em', marginBottom: 12 }}>INSTALACIÓN</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { activa: false, label: 'La instalo yo', desc: 'Instalación propia', img: '/images/instalacion-yo.png' },
              { activa: true, label: 'Instalación profesional', desc: 'Un instalador va a tu domicilio', img: '/images/instalacion-profesional.png' },
            ].map(({ activa, label, desc, img }) => {
              const sel = state.instalacion === activa
              return (
                <button key={label} onClick={() => setInstalacion(activa, 0)} style={cardBtn(sel)}>
                  <div style={{ width: 96, height: 96, position: 'relative', flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#F5F3EF' }}>
                    <Image src={img} alt={label} fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0A0A14', margin: '0 0 3px 0' }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{desc}</p>
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

          <div style={barraFija}>
            <button onClick={() => irA(5)} disabled={!state.sistema} style={btnSiguiente(!state.sistema)}>
              Ver resumen →
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 5 — Resumen ── */}
      {paso === 5 && (
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0A0A14', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Resumen de tu cortina
          </h2>
          <p style={{ fontSize: 14, color: '#AAA', marginBottom: 24 }}>Revisá los detalles</p>

          <div style={{ background: '#FAFAFA', borderRadius: 16, border: '1px solid #EBEBEB', overflow: 'hidden', marginBottom: 16 }}>
            {[
              { label: 'Tipo', value: state.tipo?.nombre },
              { label: 'Tela', value: state.tela?.nombre },
              { label: 'Color', value: state.color?.nombre },
              { label: 'Medidas', value: state.ancho && state.alto ? `${state.ancho} × ${state.alto} cm` : null },
              { label: 'Sistema', value: state.sistema ? state.sistema.charAt(0).toUpperCase() + state.sistema.slice(1) : null },
              { label: 'Instalación', value: state.instalacion ? 'Profesional' : 'La instalo yo' },
            ].filter(i => i.value).map((item, i, arr) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}>
                <span style={{ fontSize: 14, color: '#888' }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A14' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#EEF0FF', borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{ fontSize: 13, color: '#14008C', margin: 0, lineHeight: 1.5 }}>
              El precio se confirma por WhatsApp. Te cotizamos y coordinamos juntos.
            </p>
          </div>

          <div style={barraFija}>
            <button onClick={handleAgregarAlCarrito} disabled={agregado} style={{
              ...btnSiguiente(),
              background: agregado ? '#0D7A4E' : '#14008C',
              marginBottom: 10,
              transition: 'background 0.2s',
            }}>
              {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            <button onClick={() => { resetear(); setPaso(0) }} style={{
              width: '100%', background: 'none', border: 'none',
              color: '#BBB', fontSize: 14, cursor: 'pointer', padding: '4px 0',
            }}>
              ↺ Nueva cortina
            </button>
          </div>
        </div>
      )}
    </div>
  )
}