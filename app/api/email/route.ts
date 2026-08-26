import { NextResponse } from 'next/server'
import { enviarPresupuestoPorEmail } from '@/lib/email'
import type { ItemPresupuesto } from '@/types'

interface EmailRequestBody {
  email: string
  nombreCliente?: string
  items: ItemPresupuesto[]
}

// POST /api/email – Envía el presupuesto por email al cliente
export async function POST(request: Request) {
  try {
    const body: EmailRequestBody = await request.json()

    const resultado = await enviarPresupuestoPorEmail(body)

    if (!resultado.success) {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al enviar email' },
      { status: 500 }
    )
  }
}