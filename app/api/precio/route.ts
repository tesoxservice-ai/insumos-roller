import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Redondea al múltiplo de 10 superior
function redondearArriba(valor: number, step = 10): number {
  return Math.ceil(valor / step) * step
}

const MIN_ANCHO = 50
const MAX_ANCHO = 300
const MIN_ALTO = 80
const MAX_ALTO = 350

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const anchoRaw = parseInt(searchParams.get('ancho') ?? '0')
  const altoRaw = parseInt(searchParams.get('alto') ?? '0')
  const sistemaExtra = parseInt(searchParams.get('sistemaExtra') ?? '0')
  const instExtra = parseInt(searchParams.get('instExtra') ?? '0')

  if (!anchoRaw || !altoRaw) {
    return NextResponse.json({ precio: null, fueraDeRango: false })
  }

  if (
    anchoRaw < MIN_ANCHO || anchoRaw > MAX_ANCHO ||
    altoRaw < MIN_ALTO || altoRaw > MAX_ALTO
  ) {
    return NextResponse.json({ precio: null, fueraDeRango: true })
  }

  const ancho = Math.min(redondearArriba(anchoRaw), MAX_ANCHO)
  const alto = Math.min(redondearArriba(altoRaw), MAX_ALTO)

  // Usar cliente directo con anon key (sin cookies)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('precio_exacto')
    .select('precio')
    .eq('ancho_cm', ancho)
    .eq('alto_cm', alto)
    .single()

  if (error || !data) {
    return NextResponse.json({ precio: null, fueraDeRango: true })
  }

  return NextResponse.json({
    precio: Math.round(data.precio + sistemaExtra + instExtra),
    fueraDeRango: false,
    anchoRedondeado: ancho,
    altoRedondeado: alto,
  })
}