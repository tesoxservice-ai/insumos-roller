'use client'

import type { Tela } from '@/types'

interface ProductoFormProps {
  inicial?: Partial<Tela>
  onGuardar: (datos: Partial<Tela>) => Promise<void>
}

export default function ProductoForm({ inicial, onGuardar }: ProductoFormProps) {
  // Formulario de creación/edición de productos (telas)
  return <div />
}