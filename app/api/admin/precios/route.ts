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

  const { data: reglas, error } = await supabase
    .from('regla_precio')
    .select('*, tela(nombre)')
    .order('tela_id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reglas })
}

export async function POST(request: Request) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: {
    tela_id: string
    precio_m2: number
    motorizada_extra: number
    instalacion_extra: number
    minimo_ancho: number
    maximo_ancho: number
    minimo_alto: number
    maximo_alto: number
  } = await request.json()

  const { data, error } = await supabase
    .from('regla_precio')
    .insert({
      tela_id: body.tela_id,
      precio_m2: body.precio_m2,
      motorizada_extra: body.motorizada_extra,
      instalacion_extra: body.instalacion_extra,
      minimo_ancho: body.minimo_ancho,
      maximo_ancho: body.maximo_ancho,
      minimo_alto: body.minimo_alto,
      maximo_alto: body.maximo_alto,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ regla: data }, { status: 201 })
}