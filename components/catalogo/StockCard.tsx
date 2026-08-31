'use client'

import { useState } from 'react'
import type { ProductoStock } from '@/types'
import { useCart } from '@/context/CartContext'

interface StockCardProps {
  producto: ProductoStock
  onComprar?: () => void
}

export default function StockCard({ producto, onComprar }: StockCardProps) {
  const { agregarItem } = useCart()
  const [agregado, setAgregado] = useState(false)

  const tela = (producto as unknown as Record<string, string>).tela ?? ''
  const color = (producto as unknown as Record<string, string>).color ?? ''
  const ancho = (producto as unknown as Record<string, number>).ancho ?? producto.ancho_cm
  const alto = (producto as unknown as Record<string, number>).alto ?? producto.alto_cm
  const stockDisponible = (producto as unknown as Record<string, number>).stock_disponible ?? producto.stock_cantidad

  function handleAgregar() {
    agregarItem({
      id: `stock-${producto.id}`,
      nombre: producto.nombre ?? 'Cortina roller',
      descripcion: [
        tela,
        color,
        ancho && alto ? `${ancho} × ${alto} cm` : '',
      ].filter(Boolean).join(' · '),
      precio: producto.precio ?? 0,
      tipo: 'stock',
    })
    setAgregado(true)
    onComprar?.()
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EBEBEB',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    }}
      className="stock-card"
    >
      {/* Imagen placeholder */}
      <div style={{
        height: 180,
        background: 'linear-gradient(135deg, #F0EEF8 0%, #E8E5F5 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4BEE8" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
        {stockDisponible !== undefined && stockDisponible <= 3 && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: '#FFF3CD', color: '#856404',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            borderRadius: '100px', padding: '3px 8px',
          }}>
            ÚLTIMAS UNIDADES
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#0A0A14', margin: '0 0 4px 0', lineHeight: 1.3 }}>
            {producto.nombre ?? 'Cortina Roller'}
          </p>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>
            {[tela, color, ancho && alto ? `${ancho} × ${alto} cm` : null]
              .filter(Boolean).join(' · ')}
          </p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#14008C', margin: 0, letterSpacing: '-0.03em' }}>
            ${(producto.precio ?? 0).toLocaleString('es-AR')}
          </p>

          <button
            onClick={handleAgregar}
            style={{
              background: agregado ? '#0D7A4E' : '#14008C',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
              transition: 'background 0.2s, opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => !agregado && (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {agregado ? '✓ Agregado' : '+ Agregar'}
          </button>
        </div>
      </div>

      <style>{`
        .stock-card:hover {
          box-shadow: 0 4px 20px rgba(20,0,140,0.08);
          border-color: #C4BEE8;
        }
      `}</style>
    </div>
  )
}