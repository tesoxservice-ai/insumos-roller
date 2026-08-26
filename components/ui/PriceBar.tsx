'use client'

interface PriceBarUIProps {
  precio: number
  label?: string
}

export default function PriceBar({ precio, label = 'Total estimado' }: PriceBarUIProps) {
  // Barra de precio reutilizable para distintos contextos de la UI
  return <div />
}