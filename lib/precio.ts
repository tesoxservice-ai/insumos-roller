import type { ConfiguradorState, ReglaPrecio } from '@/types'

/**
 * Calcula el precio total de una cortina según su configuración y las reglas de precio.
 * Retorna null si las medidas están fuera del rango permitido o no existe regla para la tela.
 */
export function calcularPrecio(
  state: ConfiguradorState,
  reglas: ReglaPrecio[]
): number | null {
  if (!state.tela) return null

  const regla = reglas.find((r) => r.tela_id === state.tela!.id)
  if (!regla) return null

  const { ancho, alto, sistemaExtra, instExtra } = state

  // Validar rango de medidas
  if (
    ancho < regla.minimo_ancho ||
    ancho > regla.maximo_ancho ||
    alto < regla.minimo_alto ||
    alto > regla.maximo_alto
  ) {
    return null
  }

  // Área en m² (ancho y alto vienen en cm)
  const areaM2 = (ancho * alto) / 10000

  const total = areaM2 * regla.precio_m2 + sistemaExtra + instExtra

  return Math.round(total * 100) / 100
}