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

  const [{ data: telas, error: telaError }, { data: tipos, error: tipoError }] = await Promise.all([
    supabase
      .from('tela')
      .select('*, tipo_cortina(nombre)')
      .order('orden', { ascending: true }),
    supabase
      .from('tipo_cortina')
      .select('id, nombre')
      .eq('activo', true)
      .order('orden', { ascending: true }),
  ])

  if (telaError || tipoError) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }

  return NextResponse.json({ telas, tipos })
}

export async function POST(request: Request) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: {
    nombre: string
    tipo_id: string
    descripcion: string
    tooltip: string
    checks: string[]
    activo: boolean
  } = await request.json()

  const { data, error } = await supabase
    .from('tela')
    .insert({
      nombre: body.nombre,
      tipo_id: body.tipo_id,
      descripcion: body.descripcion,
      tooltip: body.tooltip,
      checks: body.checks,
      activo: body.activo ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data }, { status: 201 })
}