import Image from 'next/image'
import Link from 'next/link'

const PASOS = [
  {
    numero: 1,
    titulo: 'Decidí el tipo de instalación',
    img: '/images/guia-medicion/paso-1.png',
    desc: `Antes de medir, tenés que saber dónde va a ir la cortina. Si la instalás dentro del hueco de la ventana, queda más prolija y sin tornillos en la pared visible. Si la instalás sobre la pared, por encima del hueco, cubrís mejor la luz que se filtra por los costados y podés hacer que la ventana parezca más grande. Esta decisión cambia completamente cómo tenés que medir.`,
  },
  {
    numero: 2,
    titulo: 'Medí el ancho',
    img: '/images/guia-medicion/paso-2.png',
    desc: `Si va dentro del hueco: medí de pared a pared en el punto más angosto del hueco. Las paredes no siempre son perfectamente rectas, así que medí en tres puntos: arriba, al medio y abajo. Quedate con la medida más chica.

Si va sobre la pared: medí el ancho del hueco y sumale entre 10 y 20 cm de cada lado. Esto evita que entre luz por los bordes y le da un aspecto más voluminoso a la ventana.`,
  },
  {
    numero: 3,
    titulo: 'Medí el alto',
    img: '/images/guia-medicion/paso-3.png',
    desc: `Si va dentro del hueco: medí desde el techo del hueco hasta el alféizar. Al igual que con el ancho, medí en tres puntos y usá la medida más chica.

Si va sobre la pared: medí desde el punto donde vas a colocar los soportes (generalmente 10 cm por encima del hueco) hasta donde querés que llegue la cortina. Puede ser el alféizar o el piso, según el efecto que busques.`,
  },
  {
    numero: 4,
    titulo: 'Anotá y verificá dos veces',
    img: '/images/guia-medicion/paso-4.png',
    desc: `Con las medidas en mano, anotá ancho y alto en centímetros antes de hacer el pedido. Volvé a medir para confirmar — un error de 2 o 3 cm puede hacer que la cortina no entre en el hueco o quede con demasiada holgura. Si tenés dudas, mandanos las medidas por WhatsApp y un asesor te ayuda a confirmar antes de fabricar.`,
  },
]

export default function GuiaMedicionPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 48px 48px' }}>
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#14008C', margin: '0 0 16px 0',
        }}>
          Guías Insumos Roller
        </p>
        <h1 style={{
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700,
          color: '#0A0A14',
          letterSpacing: '-0.02em',
          margin: '0 0 16px 0',
          lineHeight: 1.1,
        }}>
          Guía de medición
        </h1>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 0 24px 0' }} />
        <p style={{ fontSize: 17, color: '#555', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
          Seguí estos pasos para obtener las medidas correctas y garantizar que tu cortina quede perfecta a la primera.
        </p>
      </div>

      {/* Pasos */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          {PASOS.map((paso, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* Número + título */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#14008C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>{paso.numero}</span>
                </div>
                <h2 style={{
                  fontSize: 22, fontWeight: 700, color: '#0A0A14',
                  margin: 0, letterSpacing: '-0.01em',
                }}>
                  {paso.titulo}
                </h2>
              </div>

              {/* Imagen */}
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '1/1',
                borderRadius: 16, overflow: 'hidden',
                background: '#F5F3EF',
                border: '1px solid #EBEBEB',
              }}>
                <Image
                  src={paso.img}
                  alt={paso.titulo}
                  fill
                  style={{ objectFit: 'contain', padding: 24 }}
                  sizes="760px"
                />
              </div>

              {/* Texto */}
              <div style={{
                background: '#fff',
                border: '1px solid #EBEBEB',
                borderRadius: 12,
                padding: '24px 28px',
              }}>
                {paso.desc.split('\n\n').map((parrafo, j) => (
                  <p key={j} style={{
                    fontSize: 16, color: '#444', lineHeight: 1.8,
                    margin: j > 0 ? '16px 0 0 0' : 0,
                  }}>
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Separador entre pasos */}
              {i < PASOS.length - 1 && (
                <div style={{ borderBottom: '1px solid #F0F0F0', marginTop: 8 }} />
              )}
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div style={{
          marginTop: 64,
          background: '#14008C',
          borderRadius: 16,
          padding: '40px 48px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
            ¿Tenés las medidas?
          </p>
          <h3 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.01em' }}>
            Configurá tu cortina ahora
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Con tus medidas listas podés pedir tu cortina a medida en minutos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/configurador" style={{
              display: 'inline-block',
              background: '#fff', color: '#14008C',
              fontSize: 14, fontWeight: 800, letterSpacing: '0.08em',
              padding: '14px 28px', borderRadius: 8, textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}>
              CONFIGURAR CORTINA →
            </Link>
            <Link href="https://wa.me/541133802658?text=Hola%2C%20quiero%20consultar%20mis%20medidas" target="_blank" style={{
              display: 'inline-block',
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff',
              fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
              padding: '14px 28px', borderRadius: 8, textDecoration: 'none',
            }}>
              CONSULTAR POR WHATSAPP
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}