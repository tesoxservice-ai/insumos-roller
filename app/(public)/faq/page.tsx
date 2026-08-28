'use client'

import { useState } from 'react'

const FAQ_CATEGORIAS = [
  {
    categoria: 'Quiénes somos',
    id: 'nosotros',
    preguntas: [
      { q: '¿Quiénes somos?', a: '...' },
      { q: '¿Dónde están ubicados?', a: '...' },
      { q: '¿Cuántos años de experiencia tienen?', a: '...' },
      { q: '¿Fabrican ellos mismos o revenden?', a: '...' },
    ],
  },
  {
    categoria: 'Productos y Materiales',
    preguntas: [
      { q: '¿Qué tipos de cortinas ofrecen?', a: '...' },
      { q: '¿Qué telas o materiales tienen disponibles?', a: '...' },
      { q: '¿Las cortinas son blackout, semitransparentes o traslúcidas?', a: '...' },
      { q: '¿Tienen cortinas ignífugas o especiales para uso comercial?', a: '...' },
      { q: '¿Qué diferencia hay entre cortinas, visillos, enrollables y estores?', a: '...' },
      { q: '¿Las telas son lavables o resistentes a la humedad?', a: '...' },
    ],
  },
  {
    categoria: 'Medidas y Fabricación',
    preguntas: [
      { q: '¿Hacen cortinas a medida?', a: '...' },
      { q: '¿Cómo tomo las medidas de mi ventana?', a: '...' },
      { q: '¿Qué pasa si me equivoco con las medidas?', a: '...' },
      { q: '¿Cuánto tiempo demora la fabricación?', a: '...' },
      { q: '¿Tienen un tamaño mínimo o máximo?', a: '...' },
    ],
  },
  {
    categoria: 'Precios y Presupuestos',
    preguntas: [
      { q: '¿Cómo puedo pedir un presupuesto?', a: '...' },
      { q: '¿El presupuesto tiene costo?', a: '...' },
      { q: '¿Los precios incluyen instalación?', a: '...' },
      { q: '¿Cuáles son los métodos de pago?', a: '...' },
      { q: '¿Ofrecen financiamiento o cuotas?', a: '...' },
      { q: '¿Hacen descuentos por volumen o proyectos grandes?', a: '...' },
    ],
  },
  {
    categoria: 'Instalación',
    preguntas: [
      { q: '¿Hacen la instalación o solo venden el producto?', a: '...' },
      { q: '¿Cuánto cuesta la instalación?', a: '...' },
      { q: '¿En qué zonas instalan?', a: '...' },
      { q: '¿Puedo instalarlas yo mismo?', a: '...' },
      { q: '¿Cuánto tarda la instalación?', a: '...' },
    ],
  },
  {
    categoria: 'Envíos y Entregas',
    preguntas: [
      { q: '¿Hacen envíos a todo el país?', a: '...' },
      { q: '¿Cuánto demora el envío?', a: '...' },
      { q: '¿El envío tiene costo?', a: '...' },
      { q: '¿Cómo llega el pedido empaquetado?', a: '...' },
    ],
  },
  {
    categoria: 'Cambios, Garantías y Posventa',
    preguntas: [
      { q: '¿Tienen garantía los productos?', a: '...' },
      { q: '¿Qué hago si la cortina llega dañada?', a: '...' },
      { q: '¿Puedo devolver o cambiar una cortina hecha a medida?', a: '...' },
      { q: '¿Dan servicio de mantenimiento o reparación?', a: '...' },
      { q: '¿Cómo limpio y cuido mis cortinas?', a: '...' },
    ],
  },
  {
    categoria: 'Asesoramiento',
    preguntas: [
      { q: '¿Me pueden ayudar a elegir el tipo de cortina según mi ambiente?', a: '...' },
      { q: '¿Tienen muestras de telas?', a: '...' },
      { q: '¿Van a mi domicilio a asesorarme?', a: '...' },
      { q: '¿Trabajan con decoradores o arquitectos?', a: '...' },
    ],
  },
]

export default function FaqPage() {
  const [abierta, setAbierta] = useState<string | null>(null)

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pt-16">
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '80px 48px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--primary)',
            margin: '0 0 16px 0',
          }}>
            ✦ Guías MaxRoller
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

        {/* Acordeón por categoría */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {FAQ_CATEGORIAS.map(cat => (
            <div key={cat.categoria} id={cat.id ?? undefined}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                margin: '0 0 20px 0',
              }}>
                {cat.categoria}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cat.preguntas.map(item => {
                  const key = `${cat.categoria}-${item.q}`
                  const isOpen = abierta === key
                  return (
                    <div
                      key={item.q}
                      style={{
                        backgroundColor: isOpen ? 'var(--surface)' : 'transparent',
                        border: '1px solid',
                        borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        transition: 'background 0.2s, border-color 0.2s',
                      }}
                    >
                      <button
                        onClick={() => setAbierta(isOpen ? null : key)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 24,
                          textAlign: 'left',
                          padding: '24px 28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: 'var(--text)',
                          lineHeight: 1.4,
                        }}>
                          {item.q}
                        </span>
                        <span style={{
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: 24,
                          flexShrink: 0,
                          display: 'inline-block',
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}>
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 28px 24px' }}>
                          <p style={{
                            fontSize: 16,
                            color: 'var(--text-muted)',
                            lineHeight: 1.7,
                            margin: 0,
                          }}>
                            {item.a}
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

      </div>
    </div>
  )
}