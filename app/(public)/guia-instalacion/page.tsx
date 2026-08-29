import Image from 'next/image'
import Link from 'next/link'

const PASOS = [
  {
    numero: 1,
    titulo: 'Reuní las herramientas',
    img: '/images/guia-instalacion/paso-1.png',
    desc: `Antes de arrancar, tené a mano todo lo que vas a necesitar para no interrumpir el trabajo a mitad. Vas a necesitar un taladro con mecha para pared (generalmente de 6mm), tornillos y tarugos plásticos del mismo diámetro, un destornillador, un lápiz para marcar, una cinta métrica y un nivel de burbuja. Si no tenés nivel podés usar una app del celular que cumple la misma función.`,
  },
  {
    numero: 2,
    titulo: 'Marcá los puntos de perforación',
    img: '/images/guia-instalacion/paso-2.png',
    desc: `Apoyá el soporte contra la pared o dentro del hueco en el lugar donde va a ir. Con el lápiz marcá los agujeros. Antes de marcar el segundo soporte, usá el nivel para asegurarte que ambos quedan exactamente a la misma altura — si uno queda más alto que el otro la cortina va a quedar torcida. Medí también la distancia entre los dos soportes para confirmar que coincide con el ancho de tu cortina.`,
  },
  {
    numero: 3,
    titulo: 'Perforá y fijá los soportes',
    img: '/images/guia-instalacion/paso-3.png',
    desc: `Con el taladro, hacé los agujeros en los puntos que marcaste. La profundidad tiene que ser similar al largo del tarugo. Introducí los tarugos golpeándolos suavemente con un martillo hasta que queden al ras de la pared. Después atornillá los soportes firmemente — tienen que estar bien fijos, sin movimiento, porque van a sostener el peso de la cortina.`,
  },
  {
    numero: 4,
    titulo: 'Colocá la cortina y probala',
    img: '/images/guia-instalacion/paso-4.png',
    desc: `Con los soportes fijos, tomá el tubo de la cortina y encajalo en los soportes — primero de un lado, después del otro. Escuchás un click cuando entra bien. Bajá y subí la cortina varias veces para verificar que el mecanismo funciona correctamente y que la tela no roza con la pared ni con el marco. Si tiene cadena, comprobá que corre suave en ambas direcciones.`,
  },
]

export default function GuiaInstalacionPage() {
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
          Guía de instalación
        </h1>
        <div style={{ width: 32, height: 2, background: '#14008C', borderRadius: 2, margin: '0 0 24px 0' }} />
        <p style={{ fontSize: 17, color: '#555', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
          Seguí estos pasos para instalar tu cortina roller de forma rápida y segura, aunque nunca hayas instalado una antes.
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
            ¿Necesitás ayuda?
          </p>
          <h3 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.01em' }}>
            Te instalamos nosotros
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Si preferís que nuestro equipo se encargue de todo, podés agregar instalación profesional al hacer tu pedido.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/configurador" style={{
              display: 'inline-block',
              background: '#fff', color: '#14008C',
              fontSize: 14, fontWeight: 800, letterSpacing: '0.08em',
              padding: '14px 28px', borderRadius: 8, textDecoration: 'none',
            }}>
              CONFIGURAR CORTINA →
            </Link>
            <Link href="https://wa.me/541133802658?text=Hola%2C%20quiero%20consultar%20sobre%20instalaci%C3%B3n" target="_blank" style={{
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