import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('producto_stock')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ producto: data })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('producto_stock')
    .update({
      nombre: body.nombre,
      tela_id: body.tela_id,
      color_id: body.color_id,
      ancho_cm: body.ancho_cm,
      alto_cm: body.alto_cm,
      precio: body.precio,
      stock_cantidad: body.stock_cantidad,
      activo: body.activo,
      imagen_url: body.imagen_url ?? null,
    })
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ producto: data })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase
    .from('producto_stock')
    .delete()
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}