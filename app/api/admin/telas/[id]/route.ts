import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { supabase, session }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    .update({
      nombre: body.nombre,
      tipo_id: body.tipo_id,
      descripcion: body.descripcion,
      tooltip: body.tooltip,
      checks: body.checks,
      activo: body.activo,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: { activo: boolean } = await request.json()

  const { data, error } = await supabase
    .from('tela')
    .update({ activo: body.activo })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tela: data })
}