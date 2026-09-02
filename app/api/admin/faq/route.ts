import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .order('categoria', { ascending: true })
    .order('orden', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ faqs: data })
}

export async function POST(request: Request) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('faq')
    .insert({
      categoria: body.categoria,
      pregunta: body.pregunta,
      respuesta: body.respuesta,
      orden: body.orden ?? 0,
      activo: body.activo ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ faq: data }, { status: 201 })
}