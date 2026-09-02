import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con service_role — bypasea RLS.
 * Usar SOLO en rutas del admin del servidor, nunca en el cliente.
 */
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}