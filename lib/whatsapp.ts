import type { ConfiguradorState } from '@/types'

/**
 * Genera el mensaje de WhatsApp pre-completado con la configuración del usuario.
 */
export function generarMensajeWhatsApp(
  state: ConfiguradorState,
  precioTotal: number
): string {
  const sistema =
    state.sistema === 'motorizado' ? '⚡ Motorizado' : '🖐️ Manual'
  const instalacion = state.instalacion ? '✅ Con instalación' : '❌ Sin instalación'

  return (
    `🪟 *Consulta MaxRoller*\n\n` +
    `Hola! Quiero consultar por una cortina con estas características:\n\n` +
    `📦 *Tipo:* ${state.tipo?.nombre ?? '-'}\n` +
    `🧵 *Tela:* ${state.tela?.nombre ?? '-'}\n` +
    `🎨 *Color:* ${state.color?.nombre ?? '-'}\n` +
    `📐 *Medidas:* ${state.ancho} cm × ${state.alto} cm\n` +
    `⚙️ *Sistema:* ${sistema}\n` +
    `🔧 *Instalación:* ${instalacion}\n\n` +
    `💰 *Precio estimado:* $${precioTotal.toLocaleString('es-AR')}\n\n` +
    `¿Pueden confirmarme disponibilidad y plazo de entrega? ¡Gracias!`
  )
}

/**
 * Genera la URL de wa.me para abrir WhatsApp con el mensaje pre-completado.
 */
export function generarUrlWhatsApp(telefono: string, mensaje: string): string {
  const numeroLimpio = telefono.replace(/\D/g, '')
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`
}