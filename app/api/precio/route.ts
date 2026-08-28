import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/precio?ancho=120&alto=160&sistemaExtra=0&instExtra=0
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ancho = parseInt(searchParams.get('ancho') ?? '0')
  const alto = parseInt(searchParams.get('alto') ?? '0')
  const sistemaExtra = parseInt(searchParams.get('sistemaExtra') ?? '0')
  const instExtra = parseInt(searchParams.get('instExtra') ?? '0')

  if (!ancho || !alto) {
    return NextResponse.json({ precio: null })
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('precio_exacto')
    .select('precio')
    .eq('ancho_cm', ancho)
    .eq('alto_cm', alto)
    .single()

  if (error || !data) {
    return NextResponse.json({ precio: null, fueraDeRango: true })
  }

  const total = data.precio + sistemaExtra + instExtra

  return NextResponse.json({ precio: Math.round(total), fueraDeRango: false })
}