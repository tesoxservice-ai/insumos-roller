import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('producto_stock')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('PATCH stock error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ producto: data })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminSupabaseClient()

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
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('PUT stock error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ producto: data })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = createAdminSupabaseClient()

  const { error } = await supabase
    .from('producto_stock')
    .delete()
    .eq('id', params.id)

  if (error) {
    console.error('DELETE stock error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}