import { NextRequest, NextResponse } from 'next/server'

// POST /api/notificar-crm — proxy server-side al webhook del CRM (evita CORS)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const crmUrl = process.env.CRM_WEBHOOK_URL
    const secret = process.env.WEBHOOK_SECRET

    if (!crmUrl || !secret) {
      return NextResponse.json({ ok: false, error: 'Sin configuración' }, { status: 500 })
    }

    const res = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': secret,
      },
      body: JSON.stringify(body),
    })

    return NextResponse.json({ ok: res.ok }, { status: 200 })
  } catch (err) {
    console.error('[notificar-crm]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}