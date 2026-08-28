'use client'

import Link from 'next/link'
import Image from 'next/image'

const AMBIENTES = [
  { img: '/images/DORMITORIO.png', label: 'DORMITORIOS' },
  { img: '/images/OFICINA.png', label: 'OFICINAS' },
  { img: '/images/COMEDOR.png', label: 'COMEDORES' },
  { img: '/images/COCINA.png', label: 'COCINAS' },
]

const ACCESOS = [
  { num: '01', titulo: 'GUÍA DE MEDICIÓN', desc: 'Aprendé a tomar las medidas correctas para tu cortina.', href: '/guia-medicion' },
  { num: '02', titulo: 'GUÍA DE INSTALACIÓN', desc: 'Instrucciones simples para instalar tu cortina paso a paso.', href: '/guia-instalacion' },
  { num: '03', titulo: 'simulador de luz', desc: 'Conocé las diferencias entre nuestros sistemas y telas.', href: '/configurador' },
  { num: '04', titulo: 'PREGUNTAS FRECUENTES', desc: 'Respondemos las dudas más comunes antes de tu compra.', href: '/faq' },
]

const FOOTER_LINKS = {
  'PRODUCTOS': [
    { label: 'Cortinas a medida', href: '/configurador' },
    { label: 'Listas para llevar', href: '/stock' },
  ],
  'INFORMACIÓN': [
    { label: 'Quiénes somos', href: '/faq#nosotros' },
    { label: 'Envíos', href: '/#' },
    { label: 'Cambios y devoluciones', href: '/#' },
  ],
  'AYUDA': [
    { label: 'Guía de medición', href: '/guia-medicion' },
    { label: 'Guía de instalación', href: '/guia-instalacion' },
    { label: 'Preguntas frecuentes', href: '/faq' },
  ],
  'CONTACTO': [
    { label: 'WhatsApp', href: 'https://wa.me/541133802658?text=Hola%2C%20quiero%20hacer%20una%20consulta' },
    { label: 'Email', href: '/#' },
    { label: 'Formulario de contacto', href: '/#' },
  ],
}

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── HERO — sin paddingTop, el nav va encima transparente ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>
        <Image
          src="/images/LIVING.png"
          alt="Living con cortinas Insumos Roller"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 56,
          transform: 'translateY(-50%)',
        }}>
          <h1 style={{ margin: 0, padding: 0, lineHeight: 1.1 }}>
            <span style={{
              display: 'block',
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 500,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
              fontStyle: 'italic',
            }}>
              CORTINAS
            </span>
            <span style={{
              display: 'block',
              fontSize: 'clamp(14px, 1.4vw, 20px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.22em',
              marginTop: 18,
              marginBottom: 4,
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
            }}>
              QUE TRANSFORMAN
            </span>
            <span style={{
              display: 'block',
              fontSize: 'clamp(14px, 1.4vw, 20px)',
              fontWeight: 500,
              letterSpacing: '0.22em',
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>TUS </span>
              <span style={{ color: '#6B8CFF' }}>ESPACIOS</span>
            </span>
          </h1>
        </div>

        {/* Cards hero */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: 760,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0 32px',
          gap: 16,
          paddingBottom: 48,
        }}>
          <HeroCard
            href="/configurador"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            }
            label="CORTINAS A MEDIDA"
          />
          <HeroCard
            href="/stock"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            }
            label="LISTAS PARA LLEVAR"
          />
        </div>
      </section>

      {/* ── GALERÍA AMBIENTES ── */}
      <section id="inspiracion" style={{ padding: '64px 0 0', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 48px' }}>
          <p style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            INSPIRATE EN ESTOS DISEÑOS
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0 }}>
            Descubrí ambientes únicos
          </h2>
        </div>
        <div style={{ padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {AMBIENTES.map(a => (
              <Link key={a.label} href="/configurador" style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                  <Image src={a.img} alt={a.label} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} className="ambiente-img" />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '40px 24px 24px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>{a.label}</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESOS RÁPIDOS ── */}
      <section id="guias" style={{ padding: '12px 48px 64px', background: 'var(--bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {ACCESOS.map(a => (
            <Link key={a.titulo} href={a.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.2s, box-shadow 0.2s' }} className="acceso-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>{a.num}</div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text)' }}>{a.titulo}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, flex: 1 }}>{a.desc}</p>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 20 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#fff', color: '#0A0A14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', gap: 32, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(0,0,0,0.08)' }} className="footer-grid">
            <div>
              <div style={{ marginBottom: 16 }}>
                <Image src="/images/LOGO.png" alt="Insumos Roller" width={140} height={52} style={{ objectFit: 'contain', height: 48, width: 'auto' }} />
              </div>
              <p style={{ fontSize: 12, color: '#8888A8', lineHeight: 1.7, margin: 0 }}>
                Fabricación a medida.<br />Envíos a todo el país.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([titulo, links]) => (
              <div key={titulo}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#8888A8', textTransform: 'uppercase', margin: '0 0 16px 0' }}>{titulo}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#3D3D5C', textDecoration: 'none', transition: 'color 0.15s' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 12, color: '#8888A8', margin: 0 }}>© 2025 Insumos Roller. Todos los derechos reservados.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Términos y condiciones', 'Política de privacidad'].map(t => (
                <Link key={t} href="/#" style={{ fontSize: 12, color: '#8888A8', textDecoration: 'none' }}>{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .ambiente-img:hover { transform: scale(1.05); }
        .acceso-card:hover { border-color: var(--primary) !important; box-shadow: 0 4px 20px rgba(20,0,140,0.08); }
        .hero-card:hover { background: #14008C !important; }
        .hero-card:hover [data-text] { color: #fff !important; }
        .hero-card:hover [data-arrow] { color: #fff !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  )
}

function HeroCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="hero-card" style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div data-text="" style={{ color: '#14008C', flexShrink: 0, transition: 'color 0.2s' }}>{icon}</div>
          <span data-text="" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)', fontWeight: 800, letterSpacing: '0.08em', color: '#0D0D0D', transition: 'color 0.2s' }}>{label}</span>
        </div>
        <span data-arrow="" style={{ fontSize: 20, fontWeight: 700, color: '#14008C', transition: 'color 0.2s' }}>→</span>
      </div>
    </Link>
  )
}