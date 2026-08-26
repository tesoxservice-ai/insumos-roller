'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ProductoStock } from '@/types'
import Link from 'next/link'

interface ProductoStockCompleto extends ProductoStock {
  tela: { id: string; nombre: string } | null
  color: { id: string; nombre: string; hex: string } | null
}

const EMOJI_TELA: Record<string, string> = {
  blackout: '🌙',
  sunscreen: '☀️',
  doble: '✨',
}

function getEmojiTela(nombreTela: string): string {
  const key = Object.keys(EMOJI_TELA).find((k) =>
    nombreTela.toLowerCase().includes(k)
  )
  return key ? EMOJI_TELA[key] : '🪟'
}

interface ModalCompraProps {
  producto: ProductoStockCompleto
  onCerrar: () => void
}

function ModalCompra({ producto, onCerrar }: ModalCompraProps) {
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePagar = async () => {
    if (!email.trim()) return
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/stock/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: producto.id, emailPagador: email.trim() }),
      })
      const data: { init_point?: string; error?: string } = await res.json()
      if (!res.ok || !data.init_point) {
        setError(data.error ?? 'No se pudo procesar el pago. Intentá de nuevo.')
        return
      }
      window.location.href = data.init_point
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 relative"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ backgroundColor: 'var(--surface2)', color: 'var(--text-muted)' }}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          Completá tu compra
        </h2>

        {/* Resumen producto */}
        <div
          className="rounded-xl p-4 mb-5 border"
          style={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)' }}
        >
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {producto.nombre}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {producto.ancho_cm} × {producto.alto_cm} cm
          </p>
          <p className="text-xl font-bold mt-2" style={{ color: 'var(--gold)' }}>
            ${producto.precio.toLocaleString('es-AR')}
          </p>
        </div>

        {/* Email */}
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
          Tu email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePagar()}
          placeholder="tu@email.com"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border outline-none text-sm mb-4"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />

        {/* Error */}
        {error && (
          <p className="text-xs mb-3" style={{ color: '#e05555' }}>
            {error}
          </p>
        )}

        {/* Botón pagar */}
        <button
          onClick={handlePagar}
          disabled={cargando || !email.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg)',
            opacity: cargando || !email.trim() ? 0.5 : 1,
          }}
        >
          {cargando ? 'Procesando...' : 'Ir al pago →'}
        </button>
      </div>
    </div>
  )
}

interface ProductoCardProps {
  producto: ProductoStockCompleto
  onComprar: (producto: ProductoStockCompleto) => void
}

function ProductoCard({ producto, onComprar }: ProductoCardProps) {
  const hayStock = producto.stock_cantidad > 0
  const emoji = getEmojiTela(producto.tela?.nombre ?? '')

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Área visual */}
      <div
        className="relative flex items-center justify-center text-5xl flex-shrink-0"
        style={{ height: '140px', backgroundColor: 'var(--surface2)' }}
      >
        {emoji}
        {/* Círculo de color */}
        {producto.color?.hex && (
          <span
            className="absolute bottom-3 right-3 w-6 h-6 rounded-full border-2"
            style={{
              backgroundColor: producto.color.hex,
              borderColor: 'var(--border)',
            }}
            title={producto.color.nombre}
          />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {producto.nombre}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {producto.ancho_cm} × {producto.alto_cm} cm
          </p>
        </div>

        {/* Disponibilidad */}
        <span
          className="self-start text-xs font-semibold px-2.5 py-1 rounded-full"
          style={
            hayStock
              ? {
                  backgroundColor: 'var(--green-soft)',
                  color: 'var(--green)',
                  border: '1px solid var(--green)',
                }
              : {
                  backgroundColor: 'rgba(200,50,50,0.10)',
                  color: '#e05555',
                  border: '1px solid rgba(200,50,50,0.25)',
                }
          }
        >
          {hayStock ? `En stock ✓` : 'Sin stock'}
        </span>

        {/* Precio */}
        <p className="text-xl font-bold" style={{ color: 'var(--gold)' }}>
          ${producto.precio.toLocaleString('es-AR')}
        </p>

        {/* Botón comprar */}
        <button
          onClick={() => hayStock && onComprar(producto)}
          disabled={!hayStock}
          className="w-full py-2.5 rounded-xl text-sm font-semibold mt-auto transition-opacity"
          style={{
            backgroundColor: hayStock ? 'var(--gold)' : 'var(--surface2)',
            color: hayStock ? 'var(--bg)' : 'var(--text-muted)',
            opacity: hayStock ? 1 : 0.6,
            cursor: hayStock ? 'pointer' : 'not-allowed',
          }}
        >
          Comprar ahora
        </button>
      </div>
    </div>
  )
}

export default function StockPage() {
  const [productos, setProductos] = useState<ProductoStockCompleto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroTela, setFiltroTela] = useState<string>('Todos')
  const [productoModal, setProductoModal] = useState<ProductoStockCompleto | null>(null)

  const cargarProductos = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/stock')
      if (!res.ok) throw new Error('Error al cargar productos')
      const data: ProductoStockCompleto[] = await res.json()
      setProductos(data)
    } catch {
      setError('No pudimos cargar los productos. Verificá tu conexión.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // Nombres de tela únicos
  const nombresTela = useMemo(() => {
    const set = new Set(productos.map((p) => p.tela?.nombre ?? '').filter(Boolean))
    return ['Todos', ...Array.from(set)]
  }, [productos])

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    if (filtroTela === 'Todos') return productos
    return productos.filter((p) => p.tela?.nombre === filtroTela)
  }, [productos, filtroTela])

  if (cargando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-16"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--text-muted)' }}>Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 pt-16"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p style={{ color: 'var(--text)' }}>{error}</p>
          <button
            onClick={cargarProductos}
            className="px-6 py-2 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--bg)' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <span
            className="self-start text-xs font-semibold px-3 py-1"
            style={{
              backgroundColor: 'var(--gold-soft)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold)',
              borderRadius: '100px',
            }}
          >
            ✦ Disponibles ahora
          </span>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
            Cortinas en stock
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Listas para enviar. Comprá online y recibís en tu domicilio.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {nombresTela.map((nombre) => (
            <button
              key={nombre}
              onClick={() => setFiltroTela(nombre)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={{
                backgroundColor: filtroTela === nombre ? 'var(--gold)' : 'var(--surface)',
                borderColor: filtroTela === nombre ? 'var(--gold)' : 'var(--border)',
                color: filtroTela === nombre ? 'var(--bg)' : 'var(--text-mid)',
              }}
            >
              {nombre}
            </button>
          ))}
        </div>

        {/* Grilla */}
        {productosFiltrados.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3 text-center rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-4xl opacity-30">🪟</span>
            <p style={{ color: 'var(--text-muted)' }}>
              No hay productos disponibles para este filtro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onComprar={setProductoModal}
              />
            ))}
          </div>
        )}

        {/* CTA configurador */}
        <div
          className="w-full rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>
              ¿Tu ventana tiene otra medida?
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Configurá tu cortina a medida con nuestro configurador interactivo.
            </p>
          </div>
          <Link
            href="/configurador"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{
              backgroundColor: 'var(--gold)',
              color: 'var(--bg)',
            }}
          >
            Ir al configurador →
          </Link>
        </div>
      </div>

      {/* Modal */}
      {productoModal && (
        <ModalCompra
          producto={productoModal}
          onCerrar={() => setProductoModal(null)}
        />
      )}
    </div>
  )
}
