'use client'

import type { ProductoStock } from '@/types'

interface StockTableProps {
  productos: ProductoStock[]
  onEditar: (id: string) => void
  onEliminar: (id: string) => void
}

export default function StockTable({ productos, onEditar, onEliminar }: StockTableProps) {
  // Tabla de gestión de stock con acciones CRUD
  return <div />
}