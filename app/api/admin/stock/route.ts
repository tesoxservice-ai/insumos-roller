import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminSupabaseClient()
  const { data: productos, error } = await supabase
    .from('producto_stock').select('*, tela(nombre), color(nombre, hex)').order('nombre', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ productos })
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('producto_stock')
    .insert({ nombre: body.nombre, tela_id: body.tela_id, color_id: body.color_id, ancho_cm: body.ancho_cm, alto_cm: body.alto_cm, precio: body.precio, stock_cantidad: body.stock_cantidad, activo: body.activo ?? true, imagen_url: body.imagen_url ?? null })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ producto: data }, { status: 201 })
}