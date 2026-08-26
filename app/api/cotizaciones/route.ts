import { NextResponse } from 'next/server'
import type { Cotizacion } from '@/types'

// POST /api/cotizaciones – Guarda una cotización en Supabase
export async function POST(request: Request) {
  try {
    const body: Omit<Cotizacion, 'id' | 'created_at'> = await request.json()

    // TODO: insertar en Supabase con createServerSupabaseClient()
    const cotizacionGuardada: Cotizacion = {
      ...body,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(cotizacionGuardada, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Error al guardar cotización' },
      { status: 500 }
    )
  }
}