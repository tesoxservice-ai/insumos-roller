'use client'

import { useState, useEffect } from 'react'

interface FaqItem {
  id: string
  categoria: string
  pregunta: string
  respuesta: string
  orden: number
}

const ORDEN_CATEGORIAS = [
  'Quiénes somos',
  'Productos y Materiales',
  'Medidas y Fabricación',
  'Precios y Presupuestos',
  'Instalación',
  'Envíos y Entregas',
  'Cambios, Garantías y Posventa',
  'Asesoramiento',
]

export default function FaqPage() {
  const [abierta, setAbierta] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => setFaqs(data.faqs ?? []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false))
  }, [])

  // Agrupar por categoría respetando el orden
  const porCategoria = ORDEN_CATEGORIAS.reduce((acc, cat) => {
    const items = faqs.filter(f => f.categoria === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string, FaqItem[]>)

  // Categorías que no estén en el orden predefinido van al final
  const categoriasExtra = [...new Set(faqs.map(f => f.categoria))]
    .filter(cat => !ORDEN_CATEGORIAS.includes(cat))
  categoriasExtra.forEach(cat => {
    const items = faqs.filter(f => f.categoria === cat)
    if (items.length > 0) porCategoria[cat] = items
  })

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '80px 48px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--primary)',
            margin: '0 0 16px 0',
          }}>
            ✦ Guías Insumos Roller
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: '0 0 16px 0',
            lineHeight: 1.05,
          }}>
            Preguntas frecuentes
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Respondemos las dudas más comunes antes de tu compra.
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando preguntas…</p>
        ) : Object.keys(porCategoria).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No hay preguntas disponibles por el momento.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
            {Object.entries(porCategoria).map(([cat, items]) => (
              <div key={cat}>
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: 'var(--primary)', margin: '0 0 20px 0',
                }}>
                  {cat}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {items.map(item => {
                    const key = item.id
                    const isOpen = abierta === key
                    return (
                      <div key={item.id} style={{
                        backgroundColor: isOpen ? 'var(--surface)' : 'transparent',
                        border: '1px solid',
                        borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        transition: 'background 0.2s, border-color 0.2s',
                      }}>
                        <button
                          onClick={() => setAbierta(isOpen ? null : key)}
                          style={{
                            width: '100%', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', gap: 24, textAlign: 'left',
                            padding: '24px 28px', background: 'none', border: 'none', cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>
                            {item.pregunta}
                          </span>
                          <span style={{
                            color: 'var(--primary)', fontWeight: 700, fontSize: 24,
                            flexShrink: 0, display: 'inline-block',
                            transition: 'transform 0.2s',
                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          }}>
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 28px 24px' }}>
                            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                              {item.respuesta}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}