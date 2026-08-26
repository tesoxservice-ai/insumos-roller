'use client'

import type { ProductoStock } from '@/types'

interface StockCardProps {
  producto: ProductoStock
  onComprar?: () => void
}

export default function StockCard({ producto, onComprar }: StockCardProps) {
  // Card de producto en stock con precio y botón de compra
  return <div />
}