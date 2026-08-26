import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { supabase, session }
}

export async function GET() {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: productos, error } = await supabase
    .from('producto_stock')
    .select('*, tela(nombre), color(nombre, hex)')
    .order('nombre', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ productos })
}

export async function POST(request: Request) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: {
    nombre: string
    tela_id: string
    color_id: string
    ancho_cm: number
    alto_cm: number
    precio: number
    stock_cantidad: number
    activo: boolean
  } = await request.json()

  const { data, error } = await supabase
    .from('producto_stock')
    .insert({
      nombre: body.nombre,
      tela_id: body.tela_id,
      color_id: body.color_id,
      ancho_cm: body.ancho_cm,
      alto_cm: body.alto_cm,
      precio: body.precio,
      stock_cantidad: body.stock_cantidad,
      activo: body.activo ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ producto: data }, { status: 201 })
}