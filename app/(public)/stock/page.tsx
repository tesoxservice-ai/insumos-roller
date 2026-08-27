'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProductoStockCompleto {
  id: string
  nombre: string
  ancho_cm: number
  alto_cm: number
  precio: number
  activo: boolean
  stock_cantidad: number
  tela: { id: string; nombre: string } | null
  color: { id: string; nombre: string; hex: string } | null
}

const FILTROS = ['Todas', 'Blackout', 'Sunscreen', 'Doble']

export default function StockPage() {
  const [productos, setProductos] = useState<ProductoStockCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState('Todas')
  const [modalProducto, setModalProducto] = useState<ProductoStockCompleto | null>(null)
  const [email, setEmail] = useState('')
  const [loadingPago, setLoadingPago] = useState(false)
  const [errorPago, setErrorPago] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stock')
      .then(r => r.json())
      .then(d => setProductos(Array.isArray(d) ? d : (d.productos ?? [])))
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = productos.filter(p =>
    filtro === 'Todas' ? true : p.tela?.nombre === filtro
  )

  async function handleComprar() {
    if (!modalProducto || !email) return
    setLoadingPago(true)
    setErrorPago(null)
    try {
      const res = await fetch('/api/stock/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: modalProducto.id, emailPagador: email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.init_point
    } catch (e: unknown) {
      setErrorPago(e instanceof Error ? e.message : 'Error al procesar el pago')
    } finally {
      setLoadingPago(false)
    }
  }

  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingTop: 72 }}>

      {/* ── HEADER ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 40px 28px' }}>
        <h1 style={{
          fontSize: 'clamp(40px, 5vw, 60px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#0A0A14',
          margin: '0 0 10px 0',
          lineHeight: 1,
        }}>
          LISTO PARA LLEVAR
        </h1>
        <p style={{
          fontSize: 15,
          color: '#999',
          margin: 0,
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}>
          Cortinas listas para instalar.
        </p>
        <div style={{ width: 36, height: 2.5, background: '#14008C', borderRadius: 2, marginTop: 14 }} />
      </div>

      {/* ── FILTROS ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#BBB',
            letterSpacing: '0.14em', marginRight: 6,
          }}>
            FILTRAR POR TIPO
          </span>
          {FILTROS.map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '7px 20px',
                borderRadius: 3,
                border: '1.5px solid',
                borderColor: filtro === f ? '#14008C' : '#DDD',
                background: filtro === f ? '#14008C' : 'transparent',
                color: filtro === f ? '#fff' : '#555',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f === 'Todas' ? 'TODAS' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRILLA ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#BBB', fontSize: 14 }}>
            Cargando productos...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444', fontSize: 14 }}>
            {error}
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#BBB', fontSize: 14 }}>
            No hay productos disponibles.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
            className="stock-grid"
          >
            {filtrados.map(p => (
              <ProductCard
                key={p.id}
                producto={p}
                onComprar={() => p.stock_cantidad > 0 && setModalProducto(p)}
              />
            ))}
          </div>
        )}

        {/* ── BANNER MEDIDA ── */}
        <div style={{
          marginTop: 56,
          background: '#F7F7FB',
          border: '1px solid #E8E8F0',
          borderRadius: 6,
          padding: '28px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 48, height: 48,
              background: '#EEEEF8',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>
              📐
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 700, color: '#0A0A14',
                marginBottom: 3, letterSpacing: '-0.01em',
              }}>
                ¿No encontraste la medida que necesitás?
              </div>
              <div style={{ fontSize: 13, color: '#999' }}>
                Hacemos cortinas a medida para vos.
              </div>
            </div>
          </div>
          <Link href="/configurador" style={{
            background: '#14008C',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            VER CORTINAS A MEDIDA →
          </Link>
        </div>

        {/* ── DIFERENCIALES ── */}
        <div style={{
          marginTop: 28,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          paddingTop: 28,
          borderTop: '1px solid #EBEBEB',
        }}
          className="diff-grid"
        >
          {[
            { icon: '🚚', titulo: 'ENVÍO RÁPIDO', desc: 'A todo el país' },
            { icon: '🔒', titulo: 'COMPRA SEGURA', desc: 'Protegemos tus datos' },
            { icon: '⭐', titulo: 'PRODUCTOS PREMIUM', desc: 'Calidad y diseño' },
            { icon: '💳', titulo: 'HASTA 6 CUOTAS', desc: 'Sin interés' },
          ].map(d => (
            <div key={d.titulo} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{d.icon}</span>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 800, color: '#0A0A14',
                  letterSpacing: '0.1em', marginBottom: 1,
                }}>
                  {d.titulo}
                </div>
                <div style={{ fontSize: 11, color: '#999' }}>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL COMPRA ── */}
      {modalProducto && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) { setModalProducto(null); setErrorPago(null) } }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 36,
            maxWidth: 420,
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{
                fontSize: 15, fontWeight: 800, margin: 0,
                color: '#0A0A14', letterSpacing: '-0.01em',
              }}>
                Completá tu compra
              </h3>
              <button
                onClick={() => { setModalProducto(null); setErrorPago(null) }}
                style={{
                  background: 'none', border: 'none', fontSize: 22,
                  cursor: 'pointer', color: '#CCC', lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: '#F7F7FB',
              borderRadius: 6,
              padding: '14px 18px',
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A14', marginBottom: 3 }}>
                {modalProducto.nombre}
              </div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
                {modalProducto.ancho_cm} × {modalProducto.alto_cm} cm
              </div>
              <div style={{
                fontSize: 22, fontWeight: 900, color: '#0A0A14',
                letterSpacing: '-0.02em',
              }}>
                ${modalProducto.precio.toLocaleString('es-AR')}
              </div>
            </div>

            <label style={{
              fontSize: 11, fontWeight: 700, color: '#888',
              display: 'block', marginBottom: 8, letterSpacing: '0.1em',
            }}>
              TU EMAIL
            </label>
            <input
              type="email"
              placeholder="nombre@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '1.5px solid #E0E0E0',
                borderRadius: 5,
                fontSize: 14,
                outline: 'none',
                marginBottom: 16,
                fontFamily: 'inherit',
                color: '#0A0A14',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
              onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
            />

            {errorPago && (
              <div style={{
                background: '#FFF5F5', border: '1px solid #FCA5A5',
                borderRadius: 5, padding: '10px 14px',
                fontSize: 13, color: '#DC2626', marginBottom: 16,
              }}>
                {errorPago}
              </div>
            )}

            <button
              onClick={handleComprar}
              disabled={!email || loadingPago}
              style={{
                width: '100%', padding: '13px',
                background: !email || loadingPago ? '#F0F0F0' : '#14008C',
                color: !email || loadingPago ? '#BBB' : '#fff',
                border: 'none', borderRadius: 5,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                cursor: !email || loadingPago ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'opacity 0.15s',
              }}
            >
              {loadingPago ? 'PROCESANDO...' : 'IR AL PAGO →'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .stock-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .diff-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stock-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

function ProductCard({ producto: p, onComprar }: {
  producto: ProductoStockCompleto
  onComprar: () => void
}) {
  const [hoverBtn, setHoverBtn] = useState(false)
  const disponible = p.stock_cantidad > 0

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EBEBEB',
      borderRadius: 6,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Imagen */}
      <div style={{
        background: '#F5F0E8',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: '60%',
          height: '78%',
          background: p.color?.hex ?? '#E0D8CC',
          borderRadius: '3px 3px 2px 2px',
          position: 'relative',
          boxShadow: '3px 6px 20px rgba(0,0,0,0.14)',
        }}>
          <div style={{
            position: 'absolute', top: -9, left: -5, right: -5, height: 17,
            background: '#B8B0A0',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }} />
          {[15, 30, 45, 60, 75].map(pct => (
            <div key={pct} style={{
              position: 'absolute', top: `${pct}%`,
              left: 0, right: 0, height: 1,
              background: 'rgba(0,0,0,0.05)',
            }} />
          ))}
          <div style={{
            position: 'absolute', bottom: -5, left: -3, right: -3, height: 9,
            background: '#B8B0A0', borderRadius: 2,
          }} />
        </div>

        {/* Chip tela */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 3,
          padding: '3px 9px',
          fontSize: 10, fontWeight: 800,
          color: '#14008C',
          letterSpacing: '0.08em',
        }}>
          {p.tela?.nombre?.toUpperCase()}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontSize: 12, fontWeight: 800, color: '#0A0A14',
          letterSpacing: '0.04em', lineHeight: 1.3,
        }}>
          ROLLER {p.tela?.nombre?.toUpperCase()} PREMIUM
        </div>
        <div style={{ fontSize: 11, color: '#AAA', letterSpacing: '0.02em' }}>
          {p.color?.nombre} · {p.tela?.nombre}
        </div>
        <div style={{ fontSize: 11, color: '#AAA' }}>
          {p.ancho_cm} × {p.alto_cm} cm
        </div>

        <div style={{
          fontSize: 22, fontWeight: 900, color: '#0A0A14',
          letterSpacing: '-0.03em', marginTop: 6,
        }}>
          ${p.precio.toLocaleString('es-AR')}
        </div>

        {p.color && (
          <div style={{ display: 'flex', gap: 5, marginTop: 2 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: p.color.hex,
              border: '1.5px solid #fff',
              boxShadow: '0 0 0 1px #DDD',
            }} />
          </div>
        )}

        {/* Botón — blanco con borde azul */}
        <button
          onClick={onComprar}
          disabled={!disponible}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '10px',
            background: !disponible ? '#F5F5F5' : hoverBtn ? '#14008C' : '#fff',
            color: !disponible ? '#CCC' : hoverBtn ? '#fff' : '#14008C',
            border: `1.5px solid ${!disponible ? '#E0E0E0' : '#14008C'}`,
            borderRadius: 3,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            cursor: !disponible ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {!disponible ? 'SIN STOCK' : 'COMPRAR AHORA →'}
        </button>

        <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: 10, color: disponible ? '#0D7A4E' : '#999',
            display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600,
          }}>
            ✓ {disponible ? 'Disponible' : 'Sin stock'}
          </span>
          <span style={{ color: '#E0E0E0', fontSize: 10 }}>|</span>
          <span style={{ fontSize: 10, color: '#AAA', display: 'flex', alignItems: 'center', gap: 3 }}>
            🚚 Envío rápido
          </span>
        </div>
      </div>
    </div>
  )
}