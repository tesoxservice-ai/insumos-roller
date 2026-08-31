import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface ComprarBody {
  productoId: string
  emailPagador: string
}

export async function POST(request: Request) {
  try {
    const body: ComprarBody = await request.json()
    const { productoId, emailPagador } = body

    if (!productoId || !emailPagador) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: productoId y emailPagador' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { data: producto, error: productoError } = await supabase
      .from('producto_stock')
      .select('id, nombre, precio, stock_cantidad, activo, ancho_cm, alto_cm')
      .eq('id', productoId)
      .eq('activo', true)
      .single()

    if (productoError || !producto) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[stock/comprar] Producto no encontrado:', productoError)
      }
      return NextResponse.json(
        { error: 'Producto no encontrado o no disponible' },
        { status: 404 }
      )
    }

    if (producto.stock_cantidad <= 0) {
      return NextResponse.json(
        { error: 'El producto no tiene stock disponible' },
        { status: 404 }
      )
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const preference = new Preference(client)

    const isLocal = process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost')

    const response = await preference.create({
      body: {
        items: [
          {
            id: productoId,
            title: producto.nombre,
            quantity: 1,
            unit_price: producto.precio,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: emailPagador,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/stock/pago/exitoso`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/stock/pago/error`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/stock/pago/pendiente`,
        },
        payment_methods: {
          installments: 6,
        },
        ...(!isLocal && { auto_return: 'approved' }),
        notification_url: !isLocal
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/pagos/webhook`
          : undefined,
        external_reference: productoId,
      },
    })

    return NextResponse.json({
      init_point: response.init_point,
      preference_id: response.id,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[stock/comprar] Error inesperado:', error)
    }
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
}