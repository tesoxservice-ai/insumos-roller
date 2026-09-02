import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminSupabaseClient()
  const { data: telas, error } = await supabase
    .from('tela').select('*, tipo_cortina(nombre)').order('orden', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ telas })
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('tela')
    .insert({ nombre: body.nombre, tipo_id: body.tipo_id, descripcion: body.descripcion, tooltip: body.tooltip, checks: body.checks, activo: body.activo ?? true, orden: body.orden ?? 0 })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data }, { status: 201 })
}