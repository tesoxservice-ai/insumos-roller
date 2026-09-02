import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminSupabaseClient()

  const [
    { count: telas },
    { count: colores },
    { count: stock },
    { count: stockSinFoto },
  ] = await Promise.all([
    supabase.from('tela').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('color').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('producto_stock').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('producto_stock').select('*', { count: 'exact', head: true }).eq('activo', true).is('imagen_url', null),
  ])

  return NextResponse.json({
    telas: telas ?? 0,
    colores: colores ?? 0,
    stock: stock ?? 0,
    stockSinFoto: stockSinFoto ?? 0,
  })
}