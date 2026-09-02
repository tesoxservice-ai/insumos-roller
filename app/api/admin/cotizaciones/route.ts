import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)
  const estado = searchParams.get('estado')

  let query = supabase.from('cotizacion').select('*').order('created_at', { ascending: false })
  if (estado && estado !== 'todos') query = query.eq('estado', estado)

  const { data: cotizaciones, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cotizaciones })
}