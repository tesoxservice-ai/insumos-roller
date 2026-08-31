import type { ItemPresupuesto } from '@/types'

/**
 * Genera y descarga un PDF con el presupuesto usando jsPDF.
 * Solo se ejecuta en el cliente (requiere 'use client' en el componente que lo llame).
 */
export async function generarPDF(items: ItemPresupuesto[]): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margen = 20
  const anchoUtil = 210 - margen * 2
  let y = margen

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(15, 14, 12)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(201, 168, 76)
  doc.text('MaxRoller', margen, y + 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(184, 173, 158)
  doc.text('Cortinas Roller a medida', margen, y + 20)

  const fecha = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  doc.text(`Fecha: ${fecha}`, 210 - margen, y + 20, { align: 'right' })

  y = 50

  // ── Título ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(242, 237, 228)
  doc.text('Presupuesto detallado', margen, y)
  y += 10

  // ── Tabla de items ──────────────────────────────────────
  const colAmbiente = margen
  const colEspec = margen + 45
  const colMedidas = margen + 115
  const colPrecio = margen + anchoUtil

  doc.setFillColor(26, 24, 20)
  doc.rect(margen, y, anchoUtil, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(201, 168, 76)
  doc.text('Ambiente', colAmbiente + 2, y + 5.5)
  doc.text('Tela / Color', colEspec + 2, y + 5.5)
  doc.text('Medidas', colMedidas + 2, y + 5.5)
  doc.text('Precio', colPrecio, y + 5.5, { align: 'right' })
  y += 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  // Fix: usar índice clásico en vez de entries() para evitar error TS downlevelIteration
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const { configuracion: c, precioEstimado } = item
    const bgColor = i % 2 === 0 ? [34, 31, 26] : [26, 24, 20]

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    doc.rect(margen, y, anchoUtil, 12, 'F')

    doc.setTextColor(242, 237, 228)
    doc.text(item.ambiente, colAmbiente + 2, y + 5)
    doc.text(`${c.tela?.nombre ?? '-'}`, colEspec + 2, y + 5)
    doc.text(`${c.color?.nombre ?? '-'}`, colEspec + 2, y + 9.5)
    doc.text(`${c.ancho} × ${c.alto} cm`, colMedidas + 2, y + 5)
    doc.text(
      `$${precioEstimado.toLocaleString('es-AR')}`,
      colPrecio,
      y + 5,
      { align: 'right' }
    )

    y += 13

    if (y > 260 && i < items.length - 1) {
      doc.addPage()
      y = margen
    }
  }

  // ── Total ────────────────────────────────────────────────
  y += 4
  const totalGeneral = items.reduce((acc, item) => acc + item.precioEstimado, 0)

  doc.setFillColor(201, 168, 76)
  doc.rect(margen, y, anchoUtil, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(15, 14, 12)
  doc.text('TOTAL GENERAL', colAmbiente + 2, y + 7)
  doc.text(`$${totalGeneral.toLocaleString('es-AR')}`, colPrecio, y + 7, {
    align: 'right',
  })

  // ── Footer ────────────────────────────────────────────────
  y += 20
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(122, 114, 105)
  doc.text('Este presupuesto tiene vigencia de 48 horas hábiles.', margen, y)
  doc.text('maxroller.com.ar', 210 - margen, y, { align: 'right' })

  doc.save(`presupuesto-maxroller-${Date.now()}.pdf`)
}