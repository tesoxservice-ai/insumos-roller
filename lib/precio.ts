import type { ConfiguradorState, ReglaPrecio } from '@/types'

const MIN_ANCHO = 50
const MAX_ANCHO = 300
const MIN_ALTO = 80
const MAX_ALTO = 350

function redondearArriba(valor: number, step = 10): number {
  return Math.ceil(valor / step) * step
}

/**
 * Verifica si las medidas están dentro del rango permitido.
 */
export function estaEnRango(ancho: number, alto: number): boolean {
  return (
    ancho >= MIN_ANCHO && ancho <= MAX_ANCHO &&
    alto >= MIN_ALTO && alto <= MAX_ALTO
  )
}

/**
 * Busca el precio exacto en la API según las medidas ingresadas.
 * Redondea al múltiplo de 10 superior automáticamente.
 * Retorna null si está fuera de rango o hay error.
 */
export async function fetchPrecio(
  ancho: number,
  alto: number,
  sistemaExtra = 0,
  instExtra = 0
): Promise<{ precio: number | null; fueraDeRango: boolean; anchoRedondeado?: number; altoRedondeado?: number }> {
  if (!ancho || !alto) return { precio: null, fueraDeRango: false }

  const params = new URLSearchParams({
    ancho: String(ancho),
    alto: String(alto),
    sistemaExtra: String(sistemaExtra),
    instExtra: String(instExtra),
  })

  try {
    const res = await fetch(`/api/precio?${params}`)
    const data = await res.json()
    return data
  } catch {
    return { precio: null, fueraDeRango: false }
  }
}

/**
 * Calcula precio de forma síncrona (fallback con precio_m2).
 * Solo se usa si no se puede acceder a precio_exacto.
 */
export function calcularPrecio(
  state: ConfiguradorState,
  reglas: ReglaPrecio[]
): number | null {
  if (!state.tela) return null

  const regla = reglas.find((r) => r.tela_id === state.tela!.id)
  if (!regla) return null

  const { ancho, alto, sistemaExtra, instExtra } = state

  if (!estaEnRango(ancho, alto)) return null

  const anchoR = Math.min(redondearArriba(ancho), MAX_ANCHO)
  const altoR = Math.min(redondearArriba(alto), MAX_ALTO)

  const areaM2 = (anchoR * altoR) / 10000
  const total = areaM2 * regla.precio_m2 + sistemaExtra + instExtra

  return Math.round(total)
}

export { MIN_ANCHO, MAX_ANCHO, MIN_ALTO, MAX_ALTO }