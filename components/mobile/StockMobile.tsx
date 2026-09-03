'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
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
  'Blanco': '#F5F2EC', 'Natural': '#D4C9B0', 'Beige': '#E8D5B0',
  'Gris': '#9E9E9E', 'Gris Marengo': '#5A5A60', 'Negro': '#1A1A1A',
}

function getTipo(p: ProductoStockCompleto): string {
  if (p.tipo) return p.tipo
  const n = p.nombre.toLowerCase()
  if (n.includes('romana')) return 'Romana'
  if (n.includes('vertical')) return 'Vertical'
  return 'Roller'
}

function limpiarNombre(nombre: string): string {
  return nombre.replace(/\s+\d+[×x]\d+cm?/i, '').trim()
}

const ar = (n: number) => `$${n.toLocaleString('es-AR')}`

interface Props {
  productos: ProductoStockCompleto[]
  loadingPago: boolean
  onComprar: (p: ProductoStockCompleto) => void
}

export default function StockMobile({ productos, loadingPago, onComprar }: Props) {
  const { agregarItem } = useCart()
  const [modalProducto, setModalProducto] = useState<ProductoStockCompleto | null>(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroTela, setFiltroTela] = useState('Todas')
  const [filtroColor, setFiltroColor] = useState('Todos')
  const [ordenar, setOrdenar] = useState('precio-asc')

  const tipos = useMemo(() => ['Todos', ...Array.from(new Set(productos.map(getTipo)))], [productos])
  const telas = useMemo(() => ['Todas', ...Array.from(new Set(productos.map(p => p.tela?.nombre).filter(Boolean) as string[]))], [productos])
  const colores = useMemo(() => ['Todos', ...Array.from(new Set(productos.map(p => p.color?.nombre).filter(Boolean) as string[]))], [productos])

  const filtrados = useMemo(() => {
    let lista = [...productos]
    if (filtroTipo !== 'Todos') lista = lista.filter(p => getTipo(p) === filtroTipo)
    if (filtroTela !== 'Todas') lista = lista.filter(p => p.tela?.nombre === filtroTela)
    if (filtroColor !== 'Todos') lista = lista.filter(p => p.color?.nombre === filtroColor)
    if (ordenar === 'precio-asc') lista.sort((a, b) => a.precio - b.precio)
    if (ordenar === 'precio-desc') lista.sort((a, b) => b.precio - a.precio)
    return lista
  }, [productos, filtroTipo, filtroTela, filtroColor, ordenar])

  const hayFiltros = filtroTipo !== 'Todos' || filtroTela !== 'Todas' || filtroColor !== 'Todos'

  function handleAgregarAlCarrito(p: ProductoStockCompleto) {
    agregarItem({
      id: p.id,
      nombre: limpiarNombre(p.nombre),
      descripcion: `${p.tela?.nombre ?? ''}${p.color?.nombre ? ` · ${p.color.nombre}` : ''} · ${p.ancho_cm}×${p.alto_cm}cm`,
      precio: p.precio,
      tipo: 'stock',
      imagen_url: p.imagen_url ?? undefined,
    }, true)
    setModalProducto(null)
  }

  const chipBtn = (activo: boolean): React.CSSProperties => ({
    padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: activo ? 700 : 400,
    border: `1.5px solid ${activo ? '#14008C' : '#EBEBEB'}`,
    background: activo ? 'rgba(20,0,140,0.06)' : 'transparent',
    color: activo ? '#14008C' : '#555', cursor: 'pointer', whiteSpace: 'nowrap',
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>

      {/* Header */}
      <div style={{ padding: '28px 20px 0' }}>
        <p style={{ color: '#14008C', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>LISTO PARA LLEVAR</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: '0 0 4px 0' }}>Stock disponible</h1>
        <p style={{ fontSize: 14, color: '#AAA', margin: '0 0 20px 0' }}>
          {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''} disponible{filtrados.length !== 1 ? 's' : ''}
        </p>

        {/* Barra filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => setFiltrosAbiertos(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 10,
              border: `1.5px solid ${filtrosAbiertos || hayFiltros ? '#14008C' : '#EBEBEB'}`,
              background: filtrosAbiertos || hayFiltros ? 'rgba(20,0,140,0.06)' : 'var(--surface)',
              color: filtrosAbiertos || hayFiltros ? '#14008C' : '#555',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filtros {hayFiltros && <span style={{ background: '#14008C', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>}
          </button>

          <select value={ordenar} onChange={e => setOrdenar(e.target.value)} style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 13, background: 'var(--surface)', color: '#555', outline: 'none', cursor: 'pointer' }}>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </div>

        {/* Panel de filtros */}
        {filtrosAbiertos && (
          <div style={{ background: 'var(--surface)', border: '1px solid #EBEBEB', borderRadius: 14, padding: '16px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.1em', margin: '0 0 10px 0' }}>TIPO</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tipos.map(t => (
                  <button key={t} onClick={() => setFiltroTipo(t)} style={chipBtn(filtroTipo === t)}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.1em', margin: '0 0 10px 0' }}>TELA</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {telas.map(t => (
                  <button key={t} onClick={() => setFiltroTela(t)} style={chipBtn(filtroTela === t)}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.1em', margin: '0 0 10px 0' }}>COLOR</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => setFiltroColor('Todos')} style={{ ...chipBtn(filtroColor === 'Todos'), fontSize: 12 }}>Todos</button>
                {colores.filter(c => c !== 'Todos').map(c => (
                  <button key={c} onClick={() => setFiltroColor(c === filtroColor ? 'Todos' : c)} style={{ width: 32, height: 32, borderRadius: '50%', background: COLORES_INFO[c] ?? '#CCC', border: c === filtroColor ? '3px solid #14008C' : '2px solid #DDD', cursor: 'pointer', boxShadow: c === filtroColor ? '0 0 0 2px rgba(20,0,140,0.2)' : 'none' }} title={c} />
                ))}
              </div>
            </div>

            {hayFiltros && (
              <button onClick={() => { setFiltroTipo('Todos'); setFiltroTela('Todas'); setFiltroColor('Todos') }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#14008C', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                × Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grilla 2x2 */}
      <div style={{ padding: '0 20px 40px' }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#AAA' }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>Sin productos con esos filtros</p>
            <button onClick={() => { setFiltroTipo('Todos'); setFiltroTela('Todas'); setFiltroColor('Todos') }} style={{ background: '#14008C', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Ver todos
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {filtrados.map(p => {
              const disponible = p.stock_cantidad > 0
              const tipo = getTipo(p)
              return (
                <div key={p.id} onClick={() => setModalProducto(p)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>

                  {/* Imagen */}
                  <div style={{ position: 'relative', aspectRatio: '3/2', background: '#F5F0E8' }}>
                    {p.imagen_url ? (
                      <Image src={p.imagen_url} alt={p.nombre} fill sizes="50vw" style={{ objectFit: 'contain', padding: 8 }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 120 140" width="60" height="70" fill="none">
                          <rect x="20" y="18" width="80" height="8" rx="4" fill="#C8C0B0"/>
                          <rect x="28" y="24" width="64" height="90" rx="2" fill="#E0D8CC"/>
                          <rect x="26" y="112" width="68" height="6" rx="3" fill="#C8C0B0"/>
                        </svg>
                      </div>
                    )}
                    {/* Badge tipo */}
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#14008C', letterSpacing: '0.06em' }}>
                      {tipo.toUpperCase()}
                    </div>
                    {/* Badge tela */}
                    {p.tela && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 600, color: '#555' }}>
                        {p.tela.nombre}
                      </div>
                    )}
                    {!disponible && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em' }}>AGOTADO</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '10px 12px 12px' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0A0A14', margin: '0 0 2px 0', lineHeight: 1.3 }}>{limpiarNombre(p.nombre)}</p>
                    <p style={{ fontSize: 11, color: '#888', margin: '0 0 6px 0' }}>
                      {p.ancho_cm}×{p.alto_cm}cm
                      {p.color && <span style={{ marginLeft: 6 }}>· {p.color.nombre}</span>}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#14008C', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>{ar(p.precio)}</p>
                    <button
                      onClick={e => { e.stopPropagation(); disponible && handleAgregarAlCarrito(p) }}
                      disabled={!disponible}
                      style={{
                        width: '100%', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        background: disponible ? '#14008C' : '#E0E0E0',
                        color: disponible ? '#fff' : '#AAA',
                        border: 'none', cursor: disponible ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {disponible ? '+ Agregar' : 'Agotado'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {modalProducto && (
        <div onClick={() => setModalProducto(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '20px 20px 40px' }}>

            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#DDD', margin: '0 auto 20px' }} />

            {/* Imagen grande */}
            <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F5F0E8', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
              {modalProducto.imagen_url ? (
                <Image src={modalProducto.imagen_url} alt={modalProducto.nombre} fill sizes="100vw" style={{ objectFit: 'contain', padding: 16 }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 120 140" width="80" height="95" fill="none">
                    <rect x="20" y="18" width="80" height="8" rx="4" fill="#C8C0B0"/>
                    <rect x="28" y="24" width="64" height="90" rx="2" fill="#E0D8CC"/>
                    <rect x="26" y="112" width="68" height="6" rx="3" fill="#C8C0B0"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ background: '#EEF0FF', color: '#14008C', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{getTipo(modalProducto).toUpperCase()}</span>
              {modalProducto.tela && <span style={{ background: 'var(--surface2)', color: '#555', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>{modalProducto.tela.nombre}</span>}
              {modalProducto.color && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#555' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: modalProducto.color.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                  {modalProducto.color.nombre}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A0A14', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>{limpiarNombre(modalProducto.nombre)}</h2>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 16px 0' }}>{modalProducto.ancho_cm} × {modalProducto.alto_cm} cm</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#14008C', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{ar(modalProducto.precio)}</p>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: modalProducto.stock_cantidad > 0 ? '#0D7A4E' : '#ef4444' }} />
              <span style={{ fontSize: 13, color: modalProducto.stock_cantidad > 0 ? '#0D7A4E' : '#ef4444', fontWeight: 600 }}>
                {modalProducto.stock_cantidad > 0 ? `${modalProducto.stock_cantidad} disponible${modalProducto.stock_cantidad > 1 ? 's' : ''}` : 'Sin stock'}
              </span>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => handleAgregarAlCarrito(modalProducto)}
                disabled={modalProducto.stock_cantidad === 0}
                style={{ width: '100%', padding: '16px', background: modalProducto.stock_cantidad > 0 ? '#14008C' : '#E0E0E0', border: 'none', borderRadius: 12, color: modalProducto.stock_cantidad > 0 ? '#fff' : '#AAA', fontSize: 16, fontWeight: 700, cursor: modalProducto.stock_cantidad > 0 ? 'pointer' : 'not-allowed' }}
              >
                {modalProducto.stock_cantidad > 0 ? '+ Agregar al carrito' : 'Sin stock'}
              </button>
              <button
                onClick={() => onComprar(modalProducto)}
                disabled={loadingPago || modalProducto.stock_cantidad === 0}
                style={{ width: '100%', padding: '16px', background: 'transparent', border: '1.5px solid #14008C', borderRadius: 12, color: '#14008C', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
              >
                {loadingPago ? 'Procesando...' : 'Comprar ahora →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}