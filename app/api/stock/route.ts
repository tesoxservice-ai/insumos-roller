import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { ProductoStock } from '@/types'

interface ProductoStockCompleto extends ProductoStock {
  tela: { id: string; nombre: string } | null
  color: { id: string; nombre: string; hex: string } | null
}

// GET /api/stock — Devuelve todos los productos de stock activos con tela y color embebidos
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('producto_stock')
      .select('*, tela:tela_id(id, nombre), color:color_id(id, nombre, hex)')
      .eq('activo', true)
      .order('precio', { ascending: true })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[stock] Error al obtener productos:', error)
      }
      return NextResponse.json(
        { error: 'Error al obtener productos de stock' },
        { status: 500 }
      )
    }

    const productos = data as ProductoStockCompleto[]

    return NextResponse.json(productos)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[stock] Error inesperado en GET:', error)
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
