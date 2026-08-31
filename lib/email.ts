import { Resend } from 'resend'
import type { ItemPresupuesto } from '@/types'

interface EnviarPresupuestoParams {
  email: string
  nombreCliente?: string
  items: ItemPresupuesto[]
}

export async function enviarPresupuestoPorEmail({
  email,
  nombreCliente = 'Cliente',
  items,
}: EnviarPresupuestoParams): Promise<{ success: boolean; error?: string }> {
  // Inicializar dentro de la función para evitar error en build time
  const resend = new Resend(process.env.RESEND_API_KEY)

  const totalGeneral = items.reduce((acc, item) => acc + item.precioEstimado, 0)

  const filasItems = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #2E2A24;">${item.ambiente}</td>
          <td style="padding: 12px; border-bottom: 1px solid #2E2A24;">
            ${item.configuracion.tela?.nombre ?? '-'} – ${item.configuracion.color?.nombre ?? '-'}<br/>
            <small>${item.configuracion.ancho} × ${item.configuracion.alto} cm</small>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #2E2A24; text-align: right;">
            $${item.precioEstimado.toLocaleString('es-AR')}
          </td>
        </tr>
      `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /></head>
    <body style="background:#0F0E0C; color:#F2EDE4; font-family:sans-serif; padding:32px;">
      <h1 style="color:#C9A84C; margin-bottom:8px;">MaxRoller</h1>
      <p style="color:#B8AD9E;">Presupuesto para ${nombreCliente}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top:24px;">
        <thead>
          <tr style="background:#1A1814;">
            <th style="padding:12px; text-align:left; color:#C9A84C;">Ambiente</th>
            <th style="padding:12px; text-align:left; color:#C9A84C;">Especificación</th>
            <th style="padding:12px; text-align:right; color:#C9A84C;">Precio</th>
          </tr>
        </thead>
        <tbody>${filasItems}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px; font-weight:bold; color:#C9A84C;">TOTAL</td>
            <td style="padding:16px; font-weight:bold; color:#C9A84C; text-align:right;">
              $${totalGeneral.toLocaleString('es-AR')}
            </td>
          </tr>
        </tfoot>
      </table>
      <p style="color:#7A7269; margin-top:32px; font-size:12px;">
        Este presupuesto tiene vigencia de 48 horas. Ante cualquier consulta respondé este email.
      </p>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'MaxRoller <presupuestos@maxroller.com.ar>',
      to: email,
      subject: `Tu presupuesto MaxRoller – ${items.length} ambiente${items.length !== 1 ? 's' : ''}`,
      html,
    })
    return { success: true }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, error: mensaje }
  }
}