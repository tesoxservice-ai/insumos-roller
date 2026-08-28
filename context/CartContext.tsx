'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CartItem {
  id: string
  nombre: string
  descripcion: string
  precio: number
  cantidad: number
  tipo: 'stock' | 'medida'
  medidaEspecial?: boolean
  imagen_url?: string
}

interface CartContextType {
  items: CartItem[]
  total: number
  count: number
  drawerOpen: boolean
  hayMedidasEspeciales: boolean
  agregarItem: (item: Omit<CartItem, 'cantidad'>, abrirDrawer?: boolean) => void
  quitarItem: (id: string) => void
  cambiarCantidad: (id: string, cantidad: number) => void
  vaciarCarrito: () => void
  abrirDrawer: () => void
  cerrarDrawer: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const agregarItem = useCallback((item: Omit<CartItem, 'cantidad'>, abrirDrawer = true) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === item.id)
      if (existe) {
        return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
    if (abrirDrawer) setDrawerOpen(true)
  }, [])

  const quitarItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    if (cantidad < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }, [])

  const vaciarCarrito = useCallback(() => setItems([]), [])

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const count = items.reduce((acc, i) => acc + i.cantidad, 0)
  const hayMedidasEspeciales = items.some(i => i.medidaEspecial)

  return (
    <CartContext.Provider value={{
      items, total, count, drawerOpen, hayMedidasEspeciales,
      agregarItem, quitarItem, cambiarCantidad, vaciarCarrito,
      abrirDrawer: () => setDrawerOpen(true),
      cerrarDrawer: () => setDrawerOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}