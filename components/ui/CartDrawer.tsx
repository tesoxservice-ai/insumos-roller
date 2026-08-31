'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

// Mapeo color + tipo → imagen
function getImagenColor(descripcion: string, nombreItem: string): string {
  const slugs: Record<string, string> = {
    'Blanco': 'blanco',
    'Natural': 'natural',
    'Beige': 'beige',
    'Gris': 'gris',
    'Gris Marengo': 'gris-marengo',
    'Negro': 'negro',
  }
  const tipo = nombreItem.toLowerCase()
  const prefix = tipo.includes("vertical") || tipo.includes("banda") ? "vertical" : tipo.includes("romana") ? "romana" : "roller"
  for (const [nombre, slug] of Object.entries(slugs)) {
    if (descripcion.includes(nombre)) return `/images/colores/${prefix}-${slug}.jpg`
  }
  return ''
}

export default function CartDrawer() {
  const {
    items, total, count, drawerOpen, hayMedidasEspeciales,
    cerrarDrawer, quitarItem, vaciarCarrito,
  } = useCart()

  const [cargando, setCargando] = useState(false)

  const handlePagar = async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/pagos/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            ambiente: item.nombre,
            configuracion: item.configuracion ?? {},
            precioEstimado: item.precio * item.cantidad,
          })),
          emailPagador: 'cliente@insumosroller.com',
        }),
      })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        alert('Error al procesar el pago. Intentá de nuevo.')
      }
    } catch {
      alert('Error de conexión. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {drawerOpen && (
        <div
          onClick={cerrarDrawer}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        zIndex: 100,
        width: 480,
        maxWidth: '100vw',
        background: '#fff',
        boxShadow: '-12px 0 60px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '32px 32px 20px',
          borderBottom: '1px solid #EBEBEB',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{
                fontSize: 22, fontWeight: 900, color: '#0A0A14',
                letterSpacing: '0.12em', margin: '0 0 4px 0',
                textTransform: 'uppercase',
              }}>
                Tu pedido
              </h2>
              <p style={{ fontSize: 13, color: '#AAA', margin: 0, fontWeight: 400 }}>
                {count === 0 ? 'Sin productos' : `${count} producto${count > 1 ? 's' : ''}`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {items.length > 0 && (
                <button
                  onClick={vaciarCarrito}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, color: '#CCC', fontFamily: 'inherit',
                    transition: 'color 0.15s', padding: 0, marginTop: 2,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E53E3E'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CCC'}
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={cerrarDrawer}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#888', fontSize: 20, lineHeight: 1,
                  padding: 0, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#0A0A14'}
                onMouseLeave={e => e.currentTarget.style.color = '#888'}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: 16, paddingBottom: 80,
            }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ fontSize: 15, color: '#CCC', margin: 0, fontWeight: 500 }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={cerrarDrawer}
                style={{
                  fontSize: 13, fontWeight: 700, color: '#14008C',
                  background: 'none', border: '1.5px solid #14008C',
                  borderRadius: 8, padding: '10px 28px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#14008C'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#14008C'
                }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, idx) => {
                const imgSrc = item.imagen_url || (item.tipo === 'medida' ? getImagenColor(item.descripcion, item.nombre) : '')

                return (
                  <div key={item.id}>
                    <div style={{ display: 'flex', gap: 20, padding: '20px 0' }}>
                      {/* Imagen */}
                      <div style={{
                        width: 120, height: 120, flexShrink: 0,
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid #EBEBEB',
                        position: 'relative',
                        background: '#F5F0E8',
                      }}>
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.nombre}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="120px"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0EEF8 0%, #E8E5F5 100%)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4BEE8" strokeWidth="1">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <path d="M3 9h18M9 21V9"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: '#0A0A14', margin: 0, lineHeight: 1.3 }}>
                            {item.nombre}
                          </p>
                          <p style={{ fontSize: 16, fontWeight: 800, color: '#0A0A14', margin: 0, flexShrink: 0, marginLeft: 12 }}>
                            ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                            {item.medidaEspecial && (
                              <span style={{ fontSize: 10, color: '#92400E', marginLeft: 3 }}>*</span>
                            )}
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {item.descripcion.split(' · ').map((parte, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: '#BBBBCC', flexShrink: 0 }}>
                                {i === 0 ? (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                  </svg>
                                ) : i === 1 ? (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                                    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                                  </svg>
                                ) : (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
                                  </svg>
                                )}
                              </span>
                              <span style={{ fontSize: 13, color: '#888' }}>{parte}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                            color: item.tipo === 'medida' ? '#14008C' : '#0D7A4E',
                            background: item.tipo === 'medida' ? 'rgba(20,0,140,0.07)' : 'rgba(13,122,78,0.07)',
                            borderRadius: '100px', padding: '3px 8px',
                          }}>
                            {item.tipo === 'medida' ? 'A MEDIDA' : 'STOCK'}
                          </span>
                          <button
                            onClick={() => quitarItem(item.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 12, color: '#CCC', fontFamily: 'inherit',
                              display: 'flex', alignItems: 'center', gap: 4,
                              transition: 'color 0.15s', padding: 0,
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#E53E3E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#CCC'}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>

                        {item.medidaEspecial && (
                          <div style={{
                            background: 'rgba(245,158,11,0.07)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            borderRadius: 6, padding: '7px 10px',
                            display: 'flex', alignItems: 'flex-start', gap: 6,
                          }}>
                            <span style={{ fontSize: 11, flexShrink: 0 }}>⚠️</span>
                            <p style={{ fontSize: 11, color: '#92400E', margin: 0, lineHeight: 1.4 }}>
                              Medidas especiales — precio a confirmar por WhatsApp
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {idx < items.length - 1 && (
                      <div style={{ height: 1, background: '#F0F0F0' }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '24px 32px 32px',
            borderTop: '1px solid #EBEBEB',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 15, color: '#888', margin: '0 0 3px 0', fontWeight: 500 }}>Total estimado</p>
                <p style={{ fontSize: 12, color: '#CCC', margin: 0 }}>
                  El precio final se confirma antes de realizar el pago.
                </p>
              </div>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#0A0A14', letterSpacing: '-0.03em' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Aviso medidas especiales */}
            {hayMedidasEspeciales && (
              <div style={{
                background: 'rgba(245,158,11,0.07)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  Debido al excedente de medida de una o más cortinas, el pedido debe confirmarse por WhatsApp antes de procesar el pago.
                </p>
              </div>
            )}

            {/* Botón pagar */}
            <button
              onClick={handlePagar}
              disabled={hayMedidasEspeciales || cargando}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: hayMedidasEspeciales ? '#E5E5E5' : '#14008C',
                color: hayMedidasEspeciales ? '#AAA' : '#fff',
                border: 'none', borderRadius: 12,
                padding: '16px 24px',
                fontSize: 15, fontWeight: 700,
                cursor: hayMedidasEspeciales || cargando ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.02em',
                transition: 'opacity 0.15s',
                opacity: cargando ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!hayMedidasEspeciales && !cargando) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = cargando ? '0.7' : '1' }}
            >
              <span>{cargando ? 'Procesando...' : 'Finalizar pedido'}</span>
              <span style={{ fontSize: 20 }}>{cargando ? '⏳' : '→'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/541133802658?text=${encodeURIComponent(
                '¡Hola! Quiero confirmar el siguiente pedido:\n\n' +
                items.map(i =>
                  `• ${i.nombre}\n  ${i.descripcion}${i.cantidad > 1 ? ` x${i.cantidad}` : ''} — $${(i.precio * i.cantidad).toLocaleString('es-AR')}${i.medidaEspecial ? ' ⚠️ medida especial, precio a confirmar' : ''}`
                ).join('\n') +
                `\n\nTotal estimado: $${total.toLocaleString('es-AR')}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10,
                background: '#fff',
                color: '#1B5E3B',
                border: '1.5px solid #1B5E3B',
                borderRadius: 12,
                padding: '14px 24px',
                fontSize: 15, fontWeight: 700,
                textDecoration: 'none', fontFamily: 'inherit',
                letterSpacing: '0.02em',
                transition: 'background 0.15s, color 0.15s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1B5E3B'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.color = '#1B5E3B'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmar por WhatsApp
            </a>

            {/* Sello seguridad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#F5F5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#555', margin: '0 0 2px 0' }}>
                  Tu información está protegida
                </p>
                <p style={{ fontSize: 11, color: '#AAA', margin: 0 }}>
                  Usamos cifrado SSL para garantizar la seguridad de tus datos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}