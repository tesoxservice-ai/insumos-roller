import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('tela')
    .update({ nombre: body.nombre, tipo_id: body.tipo_id, descripcion: body.descripcion, tooltip: body.tooltip, checks: body.checks, activo: body.activo, orden: body.orden })
    .eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('tela').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase.from('tela').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}