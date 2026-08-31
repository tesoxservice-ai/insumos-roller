import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import type { ItemPresupuesto } from '@/types'

interface CrearPreferenciaBody {
  items: ItemPresupuesto[]
  emailPagador: string
}

export async function POST(request: Request) {
  try {
    const { items, emailPagador }: CrearPreferenciaBody = await request.json()

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const preference = new Preference(client)

    const mpItems = items.map((item, idx) => ({
      id: String(idx + 1),
      title: `${item.ambiente} – ${item.configuracion?.tela?.nombre ?? 'Cortina Roller'}`,
      quantity: 1,
      unit_price: item.precioEstimado,
      currency_id: 'ARS',
    }))

    const isLocal = process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost')

    const response = await preference.create({
      body: {
        items: mpItems,
        payer: { email: emailPagador },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/pago/exitoso`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pago/error`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pago/pendiente`,
        },
        payment_methods: {
          installments: 6,
        },
        ...(!isLocal && { auto_return: 'approved' }),
        notification_url: !isLocal
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/pagos/webhook`
          : undefined,
      },
    })

    return NextResponse.json({ init_point: response.init_point })
  } catch (error) {
    console.error('MP Error completo:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago', detalle: String(error) },
      { status: 500 }
    )
  }
}