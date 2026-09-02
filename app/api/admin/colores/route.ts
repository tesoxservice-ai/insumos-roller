import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminSupabaseClient()
  const { data: colores, error } = await supabase
    .from('color')
    .select('*, tela(nombre)')
    .order('orden', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ colores })
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('color')
    .insert({ tela_id: body.tela_id, nombre: body.nombre, hex: body.hex, activo: body.activo ?? true })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ color: data }, { status: 201 })
}