import { NextResponse } from 'next/server'

// POST /api/pagos/webhook – Recibe notificaciones de Mercado Pago
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // TODO: validar firma del webhook y actualizar estado de cotización en Supabase
    const { type, data } = body as { type: string; data: { id: string } }

    if (type === 'payment') {
      // Procesar notificación de pago con data.id
      void data // evitar warning de variable no usada hasta implementar
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}