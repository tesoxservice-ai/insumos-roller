import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { CatalogoCompleto, TipoCortina, Tela, Color, ReglaPrecio } from '@/types'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const [tiposRes, telasRes, coloresRes, preciosRes] = await Promise.all([
      supabase
        .from('tipo_cortina')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true }),
      supabase
        .from('tela')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true }),
      supabase
        .from('color')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true }),
      supabase
        .from('regla_precio')
        .select('*'),
    ])

    if (tiposRes.error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[catalogo] Error al obtener tipos:', tiposRes.error)
      }
      return NextResponse.json(
        { error: 'Error al obtener tipos de cortina' },
        { status: 500 }
      )
    }

    if (telasRes.error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[catalogo] Error al obtener telas:', telasRes.error)
      }
      return NextResponse.json(
        { error: 'Error al obtener telas' },
        { status: 500 }
      )
    }

    if (coloresRes.error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[catalogo] Error al obtener colores:', coloresRes.error)
      }
      return NextResponse.json(
        { error: 'Error al obtener colores' },
        { status: 500 }
      )
    }

    if (preciosRes.error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[catalogo] Error al obtener precios:', preciosRes.error)
      }
      return NextResponse.json(
        { error: 'Error al obtener reglas de precio' },
        { status: 500 }
      )
    }

    const catalogo: CatalogoCompleto = {
      tipos: tiposRes.data as TipoCortina[],
      telas: telasRes.data as Tela[],
      colores: coloresRes.data as Color[],
      precios: preciosRes.data as ReglaPrecio[],
    }

    return NextResponse.json(catalogo, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[catalogo] Error inesperado en GET:', error)
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const expectedToken = `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Revalidación manual del caché — agregar lógica adicional aquí según necesidad
    return NextResponse.json(
      { revalidated: true, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[catalogo] Error inesperado en POST:', error)
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
