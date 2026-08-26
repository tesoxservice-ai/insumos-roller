'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ItemPresupuesto, ConfiguradorState } from '@/types'

interface AgregarItemParams {
  ambiente: string
  configuracion: ConfiguradorState
  precioEstimado: number
}

interface UsePresupuestoReturn {
  items: ItemPresupuesto[]
  agregarItem: (params: AgregarItemParams) => void
  eliminarItem: (index: number) => void
  totalGeneral: number
  limpiarPresupuesto: () => void
}

export function usePresupuesto(): UsePresupuestoReturn {
  const [items, setItems] = useState<ItemPresupuesto[]>([])

  const agregarItem = useCallback(
    ({ ambiente, configuracion, precioEstimado }: AgregarItemParams) => {
      setItems((prev) => [
        ...prev,
        { ambiente, configuracion, precioEstimado },
      ])
    },
    []
  )

  const eliminarItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const limpiarPresupuesto = useCallback(() => {
    setItems([])
  }, [])

  const totalGeneral = useMemo(
    () => items.reduce((acc, item) => acc + item.precioEstimado, 0),
    [items]
  )

  return {
    items,
    agregarItem,
    eliminarItem,
    totalGeneral,
    limpiarPresupuesto,
  }
}