'use client'

import Link from 'next/link'
import Image from 'next/image'

const AMBIENTES = [
  { img: '/images/DORMITORIO.png', label: 'DORMITORIOS', icon: '🛏' },
  { img: '/images/OFICINA.png', label: 'OFICINAS', icon: '💼' },
  { img: '/images/COMEDOR.png', label: 'COMEDORES', icon: '🍽' },
  { img: '/images/COCINA.png', label: 'COCINAS', icon: '🍳' },
]

const ACCESOS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
      </svg>
    ),
    titulo: 'GUÍA DE MEDICIÓN',
    desc: 'Aprendé a tomar las medidas correctas para tu cortina.',
    href: '/guia-medicion',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    titulo: 'GUÍA DE INSTALACIÓN',
    desc: 'Instrucciones simples para instalar tu cortina paso a paso.',
    href: '/guia-instalacion',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
    titulo: 'ELEGÍ LA MEJOR OPCIÓN',
    desc: 'Conocé las diferencias entre nuestros sistemas y telas.',
    href: '/configurador',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    titulo: 'PREGUNTAS FRECUENTES',
    desc: 'Respondemos las dudas más comunes antes de tu compra.',
    href: '/#',
  },
]

const FOOTER_LINKS = {
  'PRODUCTOS': [
    { label: 'Cortinas a medida', href: '/configurador' },
    { label: 'Listas para llevar', href: '/stock' },
  ],
  'INFORMACIÓN': [
    { label: 'Quiénes somos', href: '/#' },
    { label: 'Envíos', href: '/#' },
    { label: 'Cambios y devoluciones', href: '/#' },
  ],
  'AYUDA': [
    { label: 'Guía de medición', href: '/guia-medicion' },
    { label: 'Guía de instalación', href: '/guia-instalacion' },
    { label: 'Preguntas frecuentes', href: '/#' },
  ],
  'CONTACTO': [
    { label: 'WhatsApp', href: '/#' },
    { label: 'Email', href: '/#' },
    { label: 'Formulario de contacto', href: '/#' },
  ],
}

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <Image
          src="/images/LIVING.png"
          alt="Living con cortinas Insumos Roller"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        {/* Overlay gradiente */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        }} />

        {/* Texto hero */}
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          transform: 'translateY(-60%)',
          padding: '0 48px',
          maxWidth: 600,
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 13, fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            CORTINAS QUE TRANSFORMAN
          </p>
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(52px, 7vw, 96px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: 0,
          }}>
            TUS<br />
            <span style={{ color: 'var(--primary)' }}>ESPACIOS</span>
          </h1>
        </div>

        {/* Cards de acción — parte inferior */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex',
          gap: 0,
        }}>
          <HeroCard
            href="/configurador"
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            }
            label="CORTINAS A MEDIDA"
          />
          <HeroCard
            href="/stock"
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            }
            label="LISTAS PARA LLEVAR"
          />
        </div>
      </section>

      {/* ── GALERÍA AMBIENTES ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{
              color: 'var(--primary)', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              INSPIRATE EN ESTOS DISEÑOS
            </p>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text)', margin: 0,
            }}>
              Descubrí ambientes únicos
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
            className="grid-ambientes"
          >
            {AMBIENTES.map(a => (
              <Link key={a.label} href="/configurador" style={{ textDecoration: 'none' }}>
                <div style={{ cursor: 'pointer' }}>
                  <div style={{
                    position: 'relative', aspectRatio: '4/3',
                    overflow: 'hidden', borderRadius: 'var(--radius)',
                    marginBottom: 12,
                  }}>
                    <Image
                      src={a.img}
                      alt={a.label}
                      fill
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      className="ambiente-img"
                    />
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{a.icon}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        letterSpacing: '0.1em', color: 'var(--text)',
                      }}>
                        {a.label}
                      </span>
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 16 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESOS RÁPIDOS ── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
            className="grid-accesos"
          >
            {ACCESOS.map(a => (
              <Link key={a.titulo} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '28px 24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                  className="acceso-card"
                >
                  <div style={{ color: 'var(--primary)' }}>{a.icon}</div>
                  <div style={{
                    fontSize: 13, fontWeight: 800,
                    letterSpacing: '0.08em', color: 'var(--text)',
                  }}>
                    {a.titulo}
                  </div>
                  <p style={{
                    fontSize: 13, color: 'var(--text-muted)',
                    lineHeight: 1.55, margin: 0, flex: 1,
                  }}>
                    {a.desc}
                  </p>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 18 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0D0D0D', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>

          {/* Logo + links */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px repeat(4, 1fr)',
            gap: 32,
            marginBottom: 48,
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
            className="footer-grid"
          >
            {/* Logo */}
            <div>
              <Image
                src="/images/logo.png"
                alt="Insumos Roller"
                width={140}
                height={56}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 16 }}
              />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Fabricación a medida.<br />Envíos a todo el país.
              </p>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([titulo, links]) => (
              <div key={titulo}>
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.4)', marginBottom: 16,
                  textTransform: 'uppercase',
                }}>
                  {titulo}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(l => (
                    <Link key={l.label} href={l.href} style={{
                      fontSize: 13, color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              © 2025 Insumos Roller. Todos los derechos reservados.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Términos y condiciones', 'Política de privacidad'].map(t => (
                <Link key={t} href="/#" style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                }}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 768px) {
          .grid-ambientes { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-accesos { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .grid-accesos { grid-template-columns: 1fr !important; }
        }
        .ambiente-img:hover { transform: scale(1.05); }
        .acceso-card:hover { border-color: var(--primary) !important; box-shadow: 0 4px 20px rgba(20,0,140,0.08); }
      `}</style>
    </main>
  )
}

function HeroCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} style={{ flex: 1, textDecoration: 'none' }}>
      <div
        style={{
          background: '#fff',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
        className="hero-card"
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'var(--primary)'
          el.querySelectorAll('*').forEach((c: Element) => {
            (c as HTMLElement).style.color = '#fff'
          })
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = '#fff'
          el.querySelectorAll('*').forEach((c: Element) => {
            (c as HTMLElement).style.color = ''
          })
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</div>
          <span style={{
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text)',
          }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>→</span>
      </div>
    </Link>
  )
}