'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

interface ProductoStockCompleto {
  id: string
  nombre: string
  ancho_cm: number
  alto_cm: number
  precio: number
  activo: boolean
  stock_cantidad: number
  tipo: string | null
  imagen_url: string | null
  tela: { id: string; nombre: string } | null
  color: { id: string; nombre: string; hex: string } | null
}

const COLORES_INFO: Record<string, string> = {
  'Blanco': '#F5F2EC',
  'Natural': '#D4C9B0',
  'Beige': '#E8D5B0',
  'Gris': '#9E9E9E',
  'Gris Marengo': '#5A5A60',
  'Negro': '#1A1A1A',
}

function limpiarNombre(nombre: string): string {
  return nombre.replace(/\s+\d+[×x]\d+cm?/i, "").trim()
}

function getTipo(p: ProductoStockCompleto): string {
  if (p.tipo) return p.tipo
  const nombre = p.nombre.toLowerCase()
  if (nombre.includes('romana')) return 'Romana'
  if (nombre.includes('vertical')) return 'Vertical'
  return 'Roller'
}

export default function StockPage() {
  const [productos, setProductos] = useState<ProductoStockCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalProducto, setModalProducto] = useState<ProductoStockCompleto | null>(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [errorPago, setErrorPago] = useState<string | null>(null)

  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroTela, setFiltroTela] = useState('Todas')
  const [filtroColor, setFiltroColor] = useState('Todos')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [anchoMin, setAnchoMin] = useState('')
  const [anchoMax, setAnchoMax] = useState('')
  const [altoMin, setAltoMin] = useState('')
  const [altoMax, setAltoMax] = useState('')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [ordenar, setOrdenar] = useState('precio-asc')

  const { agregarItem } = useCart()

  useEffect(() => {
    fetch('/api/stock')
      .then(r => r.json())
      .then(d => setProductos(Array.isArray(d) ? d : (d.productos ?? [])))
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false))
  }, [])

  const coloresUnicos = useMemo(() => {
    const set = new Set(productos.map(p => p.color?.nombre).filter(Boolean) as string[])
    return Array.from(set)
  }, [productos])

  const precioMinTotal = useMemo(() => Math.min(...productos.map(p => p.precio)), [productos])
  const precioMaxTotal = useMemo(() => Math.max(...productos.map(p => p.precio)), [productos])

  const filtrados = useMemo(() => {
    let lista = [...productos]

    if (filtroTipo !== 'Todos') lista = lista.filter(p =>
      p.tipo === filtroTipo || p.nombre.toLowerCase().includes(filtroTipo.toLowerCase())
    )
    if (filtroTela !== 'Todas') lista = lista.filter(p => p.tela?.nombre === filtroTela)
    if (filtroColor !== 'Todos') lista = lista.filter(p => p.color?.nombre === filtroColor)
    if (soloDisponibles) lista = lista.filter(p => p.stock_cantidad > 0)
    if (precioMin) lista = lista.filter(p => p.precio >= Number(precioMin))
    if (precioMax) lista = lista.filter(p => p.precio <= Number(precioMax))
    if (anchoMin) lista = lista.filter(p => p.ancho_cm >= Number(anchoMin))
    if (anchoMax) lista = lista.filter(p => p.ancho_cm <= Number(anchoMax))
    if (altoMin) lista = lista.filter(p => p.alto_cm >= Number(altoMin))
    if (altoMax) lista = lista.filter(p => p.alto_cm <= Number(altoMax))

    if (ordenar === 'precio-asc') lista.sort((a, b) => a.precio - b.precio)
    if (ordenar === 'precio-desc') lista.sort((a, b) => b.precio - a.precio)
    if (ordenar === 'ancho-asc') lista.sort((a, b) => a.ancho_cm - b.ancho_cm)

    return lista
  }, [productos, filtroTipo, filtroTela, filtroColor, soloDisponibles, precioMin, precioMax, anchoMin, anchoMax, altoMin, altoMax, ordenar])

  function resetFiltros() {
    setFiltroTipo('Todos'); setFiltroTela('Todas'); setFiltroColor('Todos')
    setPrecioMin(''); setPrecioMax(''); setAnchoMin(''); setAnchoMax('')
    setAltoMin(''); setAltoMax(''); setSoloDisponibles(false); setOrdenar('precio-asc')
  }

  function handleAgregarAlCarrito(p: ProductoStockCompleto) {
    agregarItem({
      id: `stock-${p.id}`,
      nombre: p.nombre,
      descripcion: [p.tela?.nombre, p.color?.nombre, `${p.ancho_cm} × ${p.alto_cm} cm`].filter(Boolean).join(' · '),
      precio: p.precio,
      tipo: 'stock',
      imagen_url: p.imagen_url ?? undefined,
    }, false)
  }

  async function handleComprar() {
    if (!modalProducto) return
    setLoadingPago(true)
    setErrorPago(null)
    try {
      const res = await fetch('/api/stock/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: modalProducto.id }),
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

  const hayFiltrosActivos = filtroTipo !== 'Todos' || filtroTela !== 'Todas' || filtroColor !== 'Todos' ||
    precioMin || precioMax || anchoMin || anchoMax || altoMin || altoMax || soloDisponibles

  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh', paddingTop: 76 }}>

      <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '40px 48px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0A0A14', margin: '0 0 8px 0', lineHeight: 1 }}>
          LISTO PARA LLEVAR
        </h1>
        <p style={{ fontSize: 17, color: '#999', margin: 0 }}>Cortinas listas para instalar · {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''}</p>
        <div style={{ width: 36, height: 2.5, background: '#14008C', borderRadius: 2, marginTop: 14, marginLeft: 'auto', marginRight: 'auto' }} />
      </div>

      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '32px 48px', gap: 32, alignItems: 'flex-start' }}>

        <aside style={{ width: 280, flexShrink: 0, position: 'sticky', top: 96, maxHeight: 'calc(100vh - 112px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
          <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 12, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0A0A14', letterSpacing: '0.08em' }}>FILTROS</span>
              {hayFiltrosActivos && (
                <button onClick={resetFiltros} style={{ fontSize: 12, color: '#14008C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                  Limpiar todo
                </button>
              )}
            </div>

            <div style={{ padding: '0 24px 24px' }}>

              {/* Tipo */}
              <div style={{ paddingTop: 20, marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>TIPO DE CORTINA</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Todos', 'Roller', 'Vertical', 'Romana'].map(t => (
                    <button key={t} onClick={() => setFiltroTipo(t)} style={{
                      textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                      border: '1.5px solid', borderColor: filtroTipo === t ? '#14008C' : '#EBEBEB',
                      background: filtroTipo === t ? 'rgba(20,0,140,0.05)' : 'transparent',
                      color: filtroTipo === t ? '#14008C' : '#555',
                      fontSize: 15, fontWeight: filtroTipo === t ? 700 : 400,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tela */}
              <div style={{ marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>TIPO DE TELA</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Todas', 'Blackout', 'Sunscreen'].map(t => (
                    <button key={t} onClick={() => setFiltroTela(t)} style={{
                      textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                      border: '1.5px solid', borderColor: filtroTela === t ? '#14008C' : '#EBEBEB',
                      background: filtroTela === t ? 'rgba(20,0,140,0.05)' : 'transparent',
                      color: filtroTela === t ? '#14008C' : '#555',
                      fontSize: 15, fontWeight: filtroTela === t ? 700 : 400,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div style={{ marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>COLOR</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button onClick={() => setFiltroColor('Todos')} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: filtroColor === 'Todos' ? '3px solid #14008C' : '2px solid #DDD',
                    background: 'linear-gradient(135deg, #fff 50%, #000 50%)',
                    cursor: 'pointer', boxShadow: filtroColor === 'Todos' ? '0 0 0 3px rgba(20,0,140,0.15)' : 'none',
                    transition: 'all 0.15s', flexShrink: 0,
                  }} title="Todos" />
                  {coloresUnicos.map(c => (
                    <button key={c} onClick={() => setFiltroColor(c === filtroColor ? 'Todos' : c)} style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: filtroColor === c ? '3px solid #14008C' : '2px solid #DDD',
                      background: COLORES_INFO[c] ?? '#CCC',
                      cursor: 'pointer', boxShadow: filtroColor === c ? '0 0 0 3px rgba(20,0,140,0.15)' : 'none',
                      transition: 'all 0.15s', flexShrink: 0,
                    }} title={c} />
                  ))}
                </div>
                {filtroColor !== 'Todos' && (
                  <p style={{ fontSize: 14, color: '#14008C', fontWeight: 600, margin: '8px 0 0 0' }}>{filtroColor}</p>
                )}
              </div>

              {/* Precio */}
              <div style={{ marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>PRECIO</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" placeholder={`$${precioMinTotal.toLocaleString('es-AR')}`} value={precioMin}
                    onChange={e => setPrecioMin(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0A0A14' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                  <span style={{ fontSize: 12, color: '#AAA', flexShrink: 0 }}>—</span>
                  <input type="number" placeholder={`$${precioMaxTotal.toLocaleString('es-AR')}`} value={precioMax}
                    onChange={e => setPrecioMax(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0A0A14' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                </div>
              </div>

              {/* Medidas */}
              <div style={{ marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>MEDIDAS (cm)</p>
                <p style={{ fontSize: 13, color: '#BBB', margin: '0 0 8px 0' }}>Ancho</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <input type="number" placeholder="Mín" value={anchoMin} onChange={e => setAnchoMin(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                  <span style={{ fontSize: 12, color: '#AAA', flexShrink: 0 }}>—</span>
                  <input type="number" placeholder="Máx" value={anchoMax} onChange={e => setAnchoMax(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                </div>
                <p style={{ fontSize: 13, color: '#BBB', margin: '0 0 8px 0' }}>Alto</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" placeholder="Mín" value={altoMin} onChange={e => setAltoMin(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                  <span style={{ fontSize: 12, color: '#AAA', flexShrink: 0 }}>—</span>
                  <input type="number" placeholder="Máx" value={altoMax} onChange={e => setAltoMax(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#14008C'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
                  />
                </div>
              </div>

              {/* Solo disponibles */}
              <div style={{ marginBottom: 20, borderBottom: '1px solid #F0F0F0', paddingBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div onClick={() => setSoloDisponibles(!soloDisponibles)} style={{
                    width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                    background: soloDisponibles ? '#14008C' : '#DDD',
                    position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3,
                      left: soloDisponibles ? 23 : 3,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }} />
                  </div>
                  <span style={{ fontSize: 15, color: '#555', fontWeight: 500 }}>Solo disponibles</span>
                </label>
              </div>

              {/* Ordenar */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#AAA', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>ORDENAR POR</p>
                <select value={ordenar} onChange={e => setOrdenar(e.target.value)} style={{
                  width: '100%', padding: '10px 12px',
                  border: '1.5px solid #E0E0E0', borderRadius: 8,
                  fontSize: 15, color: '#0A0A14', background: '#fff',
                  outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                }}>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="ancho-asc">Menor ancho</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* GRILLA */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#BBB', fontSize: 14 }}>Cargando productos...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444', fontSize: 14 }}>{error}</div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 16, color: '#BBB', margin: '0 0 16px 0' }}>No hay productos con esos filtros.</p>
              <button onClick={resetFiltros} style={{ fontSize: 14, fontWeight: 700, color: '#14008C', background: 'none', border: '1.5px solid #14008C', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="stock-grid">
              {filtrados.map(p => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onVerDetalle={() => setModalProducto(p)}
                  onAgregarAlCarrito={() => handleAgregarAlCarrito(p)}
                />
              ))}
            </div>
          )}

          <div style={{ marginTop: 48, background: '#fff', border: '1px solid #E8E8F0', borderRadius: 12, padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 48, height: 48, background: '#EEEEF8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📐</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A14', marginBottom: 3 }}>¿No encontraste la medida que necesitás?</div>
                <div style={{ fontSize: 13, color: '#999' }}>Hacemos cortinas a medida para vos.</div>
              </div>
            </div>
            <Link href="/configurador" style={{ background: '#14008C', color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
              VER CORTINAS A MEDIDA →
            </Link>
          </div>

          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingTop: 24, borderTop: '1px solid #EBEBEB' }} className="diff-grid">
            {[
              { icon: '🚚', titulo: 'ENVÍO RÁPIDO', desc: 'A todo el país' },
              { icon: '🔒', titulo: 'COMPRA SEGURA', desc: 'Protegemos tus datos' },
              { icon: '⭐', titulo: 'PRODUCTOS PREMIUM', desc: 'Calidad y diseño' },
              { icon: '💳', titulo: 'HASTA 6 CUOTAS', desc: 'Con interés' },
            ].map(d => (
              <div key={d.titulo} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0A0A14', letterSpacing: '0.1em', marginBottom: 1 }}>{d.titulo}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalProducto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) { setModalProducto(null); setErrorPago(null) } }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 760, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            <div style={{ position: 'relative', background: '#fff', minHeight: 460 }}>
              {modalProducto.imagen_url ? (
                <Image src={modalProducto.imagen_url} alt={modalProducto.nombre} fill style={{ objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8' }}>
                  <div style={{ width: '55%', height: '70%', background: modalProducto.color?.hex ?? '#E0D8CC', borderRadius: 4 }} />
                </div>
              )}
            </div>

            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#14008C', letterSpacing: '0.12em', background: 'rgba(20,0,140,0.07)', borderRadius: 100, padding: '3px 10px' }}>
                    {modalProducto.tela?.nombre?.toUpperCase() ?? 'ROMANA'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '0.12em', background: '#F5F5F5', borderRadius: 100, padding: '3px 10px' }}>
                    {getTipo(modalProducto).toUpperCase()}
                  </span>
                </div>
                <button onClick={() => { setModalProducto(null); setErrorPago(null) }} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#CCC' }}>×</button>
              </div>

              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A0A14', margin: '0 0 6px 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{limpiarNombre(modalProducto.nombre)}</h2>
                <p style={{ fontSize: 14, color: '#999', margin: 0 }}>{modalProducto.color?.nombre} · {modalProducto.ancho_cm} × {modalProducto.alto_cm} cm</p>
              </div>

              {modalProducto.color && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: modalProducto.color.hex, border: '2px solid #fff', boxShadow: '0 0 0 1.5px #DDD' }} />
                  <span style={{ fontSize: 14, color: '#666' }}>{modalProducto.color.nombre}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Medidas', valor: `${modalProducto.ancho_cm} × ${modalProducto.alto_cm} cm` },
                  { label: 'Tipo', valor: getTipo(modalProducto) },
                  { label: 'Tela', valor: modalProducto.tela?.nombre ?? '—' },
                  { label: 'Sistema', valor: 'Cadena manual' },
                  { label: 'Stock', valor: modalProducto.stock_cantidad > 0 ? `${modalProducto.stock_cantidad} disponibles` : 'Sin stock' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F5F5F5' }}>
                    <span style={{ fontSize: 14, color: '#999' }}>{r.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A14' }}>{r.valor}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 34, fontWeight: 900, color: '#0A0A14', letterSpacing: '-0.04em' }}>
                ${modalProducto.precio.toLocaleString('es-AR')}
              </div>

              {errorPago && (
                <div style={{ background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{errorPago}</div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                <button onClick={() => { handleAgregarAlCarrito(modalProducto); setModalProducto(null) }}
                  style={{ width: '100%', padding: '14px', background: '#14008C', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  + AGREGAR AL CARRITO
                </button>
                <button onClick={handleComprar} disabled={loadingPago || modalProducto.stock_cantidad === 0}
                  style={{ width: '100%', padding: '14px', background: '#fff', color: '#14008C', border: '1.5px solid #14008C', borderRadius: 8, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#14008C'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#14008C' }}>
                  {loadingPago ? 'PROCESANDO...' : 'PAGAR AHORA →'}
                </button>
                <a href={`https://wa.me/541133802658?text=${encodeURIComponent(`Hola! Me interesa:\n${modalProducto.nombre}\n${modalProducto.ancho_cm} × ${modalProducto.alto_cm} cm\n$${modalProducto.precio.toLocaleString('es-AR')}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ width: '100%', padding: '13px', background: '#fff', color: '#1B5E3B', border: '1.5px solid #1B5E3B', borderRadius: 8, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', textAlign: 'center', display: 'block', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1B5E3B'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1B5E3B' }}>
                  CONSULTAR POR WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .stock-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .stock-grid { grid-template-columns: 1fr !important; }
          .diff-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}

function ProductCard({ producto: p, onVerDetalle, onAgregarAlCarrito }: {
  producto: ProductoStockCompleto
  onVerDetalle: () => void
  onAgregarAlCarrito: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const disponible = p.stock_cantidad > 0
  const tipo = getTipo(p)

  return (
    <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, border-color 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#C4BEE8' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EBEBEB' }}
      onClick={onVerDetalle}>

      <div style={{ position: 'relative', height: 300, background: '#fff', overflow: 'hidden' }}>
        {p.imagen_url && !imgError ? (
          <Image src={p.imagen_url} alt={p.nombre} fill sizes="25vw" style={{ objectFit: 'contain' }} onError={() => setImgError(true)} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8' }}>
            <div style={{ width: '55%', height: '72%', background: p.color?.hex ?? '#E0D8CC', borderRadius: '3px 3px 2px 2px', boxShadow: '3px 6px 20px rgba(0,0,0,0.14)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -9, left: -5, right: -5, height: 17, background: '#B8B0A0', borderRadius: 8 }} />
              <div style={{ position: 'absolute', bottom: -5, left: -3, right: -3, height: 9, background: '#B8B0A0', borderRadius: 2 }} />
            </div>
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          {p.tela && (
            <span style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#14008C', letterSpacing: '0.08em' }}>
              {p.tela.nombre.toUpperCase()}
            </span>
          )}
          <span style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#555', letterSpacing: '0.08em' }}>
            {tipo.toUpperCase()}
          </span>
        </div>
        {!disponible && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#999', letterSpacing: '0.1em' }}>SIN STOCK</span>
          </div>
        )}
      </div>

      <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0A0A14', letterSpacing: '0.02em', lineHeight: 1.3 }}>
          {limpiarNombre(p.nombre).toUpperCase()}
        </div>
        <div style={{ fontSize: 14, color: '#AAA' }}>{p.color?.nombre} · {p.ancho_cm} × {p.alto_cm} cm</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: '#0A0A14', letterSpacing: '-0.03em', marginTop: 6 }}>
          ${p.precio.toLocaleString('es-AR')}
        </div>
        {p.color && (
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.color.hex, border: '1.5px solid #fff', boxShadow: '0 0 0 1px #DDD', marginTop: 2 }} />
        )}
        <button onClick={e => { e.stopPropagation(); onAgregarAlCarrito() }} disabled={!disponible}
          style={{ marginTop: 12, width: '100%', padding: '11px', background: !disponible ? '#F5F5F5' : '#14008C', color: !disponible ? '#CCC' : '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', cursor: !disponible ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', fontFamily: 'inherit' }}
          onMouseEnter={e => { if (disponible) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {!disponible ? 'SIN STOCK' : '+ AGREGAR AL CARRITO'}
        </button>
        <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: disponible ? '#0D7A4E' : '#999', fontWeight: 600 }}>✓ {disponible ? 'Disponible' : 'Sin stock'}</span>
          <span style={{ color: '#E0E0E0' }}>|</span>
          <span style={{ fontSize: 13, color: '#AAA' }}>🚚 Envío rápido</span>
        </div>
      </div>
    </div>
  )
}