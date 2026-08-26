import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { supabase, session }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, session } = await checkAuth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: { estado: string } = await request.json()

  const ESTADOS_VALIDOS = ['pendiente', 'enviada', 'aceptada', 'rechazada']
  if (!ESTADOS_VALIDOS.includes(body.estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cotizacion')
    .update({ estado: body.estado })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cotizacion: data })
}