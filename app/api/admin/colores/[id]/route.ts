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

  const body: { tela_id: string; nombre: string; hex: string; activo: boolean } = await request.json()

  const { data, error } = await supabase
    .from('color')
    .update({ tela_id: body.tela_id, nombre: body.nombre, hex: body.hex, activo: body.activo })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ color: data })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: { activo: boolean } = await request.json()

  const { data, error } = await supabase
    .from('color')
    .update({ activo: body.activo })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ color: data })
}