'use client'

import type { Color } from '@/types'

interface ColorPickerProps {
  colores: Color[]
  seleccionado: Color | null
  onSelect: (color: Color) => void
}

export default function ColorPicker({ colores, seleccionado, onSelect }: ColorPickerProps) {
  // Selector visual de colores con chips de hex
  return <div />
}