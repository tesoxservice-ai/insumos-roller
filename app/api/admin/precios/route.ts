import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminSupabaseClient()
  const { data: reglas, error } = await supabase
    .from('regla_precio').select('*, tela(nombre)').order('tela_id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reglas })
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase.from('regla_precio').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ regla: data }, { status: 201 })
}