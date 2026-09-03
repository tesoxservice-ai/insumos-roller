'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/useIsMobile'
import HomeMobile from '@/components/mobile/HomeMobile'

const AMBIENTES = [
  {
    key: 'dormitorios',
    img: '/images/DORMITORIO.png',
    label: 'DORMITORIOS',
    fotos: [
      '/images/inspiracion/dormitorios/1.jpg',
      '/images/inspiracion/dormitorios/2.jpg',
      '/images/inspiracion/dormitorios/3.jpg',
      '/images/inspiracion/dormitorios/4.jpg',
      '/images/inspiracion/dormitorios/5.jpg',
      '/images/inspiracion/dormitorios/6.jpg',
      '/images/inspiracion/dormitorios/7.jpg',
      '/images/inspiracion/dormitorios/8.jpg',
      '/images/inspiracion/dormitorios/9.jpg',
      '/images/inspiracion/dormitorios/10.jpg',
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 19V9a2 2 0 012-2h16a2 2 0 012 2v10"/>
        <path d="M2 14h20"/>
        <path d="M6 14V9.5a1.5 1.5 0 013 0V14"/>
        <path d="M15 14V9.5a1.5 1.5 0 013 0V14"/>
        <path d="M2 19h20"/>
        <path d="M4 7V5a1 1 0 011-1h14a1 1 0 011 1v2"/>
      </svg>
    ),
  },
  {
    key: 'oficinas',
    img: '/images/OFICINA.png',
    label: 'OFICINAS',
    fotos: [
      '/images/inspiracion/oficina/1.jpg',
      '/images/inspiracion/oficina/2.jpg',
      '/images/inspiracion/oficina/3.jpg',
      '/images/inspiracion/oficina/4.jpg',
      '/images/inspiracion/oficina/5.jpg',
      '/images/inspiracion/oficina/6.jpg',
      '/images/inspiracion/oficina/7.jpg',
      '/images/inspiracion/oficina/8.jpg',
      '/images/inspiracion/oficina/9.jpg',
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8"/>
        <path d="M12 17v4"/>
        <path d="M7 8h10"/>
        <path d="M7 11h6"/>
      </svg>
    ),
  },
  {
    key: 'comedores',
    img: '/images/COMEDOR.png',
    label: 'COMEDORES',
    fotos: [
      '/images/inspiracion/comedor/1.jpg',
      '/images/inspiracion/comedor/2.jpg',
      '/images/inspiracion/comedor/3.jpg',
      '/images/inspiracion/comedor/4.jpg',
      '/images/inspiracion/comedor/5.jpg',
      '/images/inspiracion/comedor/6.jpg',
      '/images/inspiracion/comedor/7.jpg',
      '/images/inspiracion/comedor/8.jpg',
      '/images/inspiracion/comedor/9.jpg',
      '/images/inspiracion/comedor/10.jpg',
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/>
        <path d="M3 6a9 9 0 0018 0"/>
        <path d="M12 6v13"/>
        <path d="M8 19h8"/>
        <circle cx="7" cy="3" r="1"/>
        <circle cx="12" cy="3" r="1"/>
        <circle cx="17" cy="3" r="1"/>
      </svg>
    ),
  },
  {
    key: 'cocinas',
    img: '/images/COCINA.png',
    label: 'COCINAS',
    fotos: [
      '/images/inspiracion/cocina/1.jpg',
      '/images/inspiracion/cocina/2.jpg',
      '/images/inspiracion/cocina/3.jpg',
      '/images/inspiracion/cocina/4.jpg',
      '/images/inspiracion/cocina/5.jpg',
      '/images/inspiracion/cocina/6.jpg',
      '/images/inspiracion/cocina/7.jpg',
      '/images/inspiracion/cocina/8.jpg',
      '/images/inspiracion/cocina/9.jpg',
      '/images/inspiracion/cocina/10.jpg',
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="1"/>
        <path d="M16 7V5a2 2 0 00-4 0v2"/>
        <circle cx="9" cy="13" r="2"/>
        <path d="M15 11h4"/>
        <path d="M15 15h4"/>
      </svg>
    ),
  },
]

const ACCESOS = [
  {
    num: '01',
    titulo: 'GUÍA DE MEDICIÓN',
    desc: 'Aprendé a tomar las medidas correctas para tu cortina.',
    href: '/guia-medicion',
    label: 'VER GUÍA',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M3 7l2-4h14l2 4M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7"/>
        <path d="M8 7v2M12 7v3M16 7v2"/>
      </svg>
    ),
  },
  {
    num: '02',
    titulo: 'GUÍA DE INSTALACIÓN',
    desc: 'Instrucciones simples para instalar tu cortina paso a paso.',
    href: '/guia-instalacion',
    label: 'VER GUÍA',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    num: '03',
    titulo: 'SIMULADOR DE LUZ',
    desc: 'Conocé las diferencias entre nuestros sistemas y telas.',
    href: '/simulador',
    label: 'PROBAR SIMULADOR',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    num: '04',
    titulo: 'PREGUNTAS FRECUENTES',
    desc: 'Respondemos las dudas más comunes antes de tu compra.',
    href: '/faq',
    label: 'IR A FAQS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
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
  const isMobile = useIsMobile()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ambienteActivo, setAmbienteActivo] = useState<typeof AMBIENTES[0] | null>(null)
  const [fotoActiva, setFotoActiva] = useState(0)

  const abrirModal = (ambiente: typeof AMBIENTES[0]) => {
    if (ambiente.fotos.length === 0) return
    setAmbienteActivo(ambiente)
    setFotoActiva(0)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setAmbienteActivo(null)
  }

  const siguiente = useCallback(() => {
    if (!ambienteActivo) return
    setFotoActiva(i => (i + 1) % ambienteActivo.fotos.length)
  }, [ambienteActivo])

  const anterior = useCallback(() => {
    if (!ambienteActivo) return
    setFotoActiva(i => (i - 1 + ambienteActivo.fotos.length) % ambienteActivo.fotos.length)
  }, [ambienteActivo])

  // Teclado
  useEffect(() => {
    if (!modalAbierto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarModal()
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'ArrowLeft') anterior()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalAbierto, siguiente, anterior])

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = modalAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalAbierto])

  if (isMobile) return <HomeMobile />

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── HERO ── */}
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
        <div style={{ position: 'absolute', top: '50%', left: 56, transform: 'translateY(-50%)' }}>
          <h1 style={{ margin: 0, padding: 0, lineHeight: 1.1 }}>
            <span style={{ display: 'block', fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 500, color: '#FFFFFF', letterSpacing: '0.06em', fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontStyle: 'italic' }}>
              CORTINAS
            </span>
            <span style={{ display: 'block', fontSize: 'clamp(14px, 1.4vw, 20px)', fontWeight: 500, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.22em', marginTop: 18, marginBottom: 4, fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}>
              QUE TRANSFORMAN
            </span>
            <span style={{ display: 'block', fontSize: 'clamp(14px, 1.4vw, 20px)', fontWeight: 500, letterSpacing: '0.22em', fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>TUS </span>
              <span style={{ color: '#6B8CFF' }}>ESPACIOS</span>
            </span>
          </h1>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 760, width: '100%', padding: '0 32px', gap: 16, paddingBottom: 48 }}>
          <HeroCard href="/configurador" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>} label="CORTINAS A MEDIDA" />
          <HeroCard href="/stock" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>} label="LISTAS PARA LLEVAR" />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ marginTop: 48 }}>
        <div style={{ background: '#F5F0E8', overflow: 'hidden', height: 56, display: 'flex', alignItems: 'center', borderTop: '1px solid #E8E0D4', borderBottom: '1px solid #E8E0D4' }}>
          <div style={{
            display: 'flex',
            animation: 'ticker 28s linear infinite',
            whiteSpace: 'nowrap',
          }}>
            {[...Array(4)].map((_, rep) => (
              <span key={rep} style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  '3 Y 6 CUOTAS SIN INTERÉS',
                  '30% DE DESCUENTO EN EFECTIVO O TRANSFERENCIA',
                ].map((text, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{
                      color: '#0A0A14',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      padding: '0 48px',
                      fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
                      fontSize: 15,
                    }}>
                      {text}
                    </span>
                    <span style={{ color: 'rgba(10,10,20,0.2)', fontSize: 10 }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
          <style>{`
            @keyframes ticker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-25%); }
            }
          `}</style>
        </div>
      </div>

      {/* ── GALERÍA AMBIENTES ── */}
      <section id="inspiracion" style={{ padding: '64px 0 0', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 48px' }}>
          <p style={{ color: '#14008C', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>INSPIRATE EN ESTOS DISEÑOS</p>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0 }}>Descubrí ambientes únicos</h2>
        </div>
        <div style={{ padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {AMBIENTES.map(a => (
              <div
                key={a.label}
                onClick={() => abrirModal(a)}
                style={{
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  transition: 'box-shadow 0.2s',
                  cursor: a.fotos.length > 0 ? 'pointer' : 'default',
                }}
                className="ambiente-card"
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Image src={a.img} alt={a.label} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} className="ambiente-img" />
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#14008C', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{a.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.12em', color: '#0A0A14' }}>{a.label}</span>
                  </div>
                  {a.fotos.length > 0 && (
                    <span style={{ color: '#14008C', fontWeight: 600, fontSize: 18 }}>→</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESOS RÁPIDOS ── */}
      <section id="guias" style={{ padding: '64px 48px 80px', background: 'var(--bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="accesos-grid">
          {ACCESOS.map(a => (
            <Link key={a.titulo} href={a.href} style={{ textDecoration: 'none' }}>
              <div
                className="acceso-card-new"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '32px 28px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: 52, height: 52, background: 'rgba(20,0,140,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14008C', marginBottom: 20 }}>
                  {a.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#14008C', letterSpacing: '0.14em', marginBottom: 12 }}>{a.num}</div>
                <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '0.04em', color: '#0A0A14', marginBottom: 14 }}>{a.titulo}</div>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px 0', flex: 1 }}>{a.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#14008C', letterSpacing: '0.1em' }}>{a.label}</span>
                  <span style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 700 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#E8E2D9', color: '#0A0A14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', gap: 32, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(0,0,0,0.08)' }} className="footer-grid">
            <div>
              <div style={{ marginBottom: 16 }}>
                <Image src="/images/LOGO.png" alt="Insumos Roller" width={140} height={52} style={{ objectFit: 'contain', height: 48, width: 'auto' }} />
              </div>
              <p style={{ fontSize: 12, color: '#8888A8', lineHeight: 1.7, margin: 0 }}>Fabricación a medida.<br />Envíos a todo el país.</p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([titulo, links]) => (
              <div key={titulo}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#8888A8', textTransform: 'uppercase', margin: '0 0 16px 0' }}>{titulo}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#3D3D5C', textDecoration: 'none' }}>{l.label}</Link>
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

      {/* ── MODAL GALERÍA ── */}
      {modalAbierto && ambienteActivo && (
        <div
          onClick={cerrarModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#fff', opacity: 0.7 }}>{ambienteActivo.icon}</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em' }}>
                  {ambienteActivo.label}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  {fotoActiva + 1} / {ambienteActivo.fotos.length}
                </span>
              </div>
              <button
                onClick={cerrarModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 8, opacity: 0.7, fontSize: 24, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Foto principal */}
            <div style={{ position: 'relative', width: '100%', height: '65vh', borderRadius: 12, overflow: 'hidden', background: '#111' }}>
              <Image
                key={fotoActiva}
                src={ambienteActivo.fotos[fotoActiva]}
                alt={`${ambienteActivo.label} ${fotoActiva + 1}`}
                sizes="(max-width: 900px) 100vw, 900px"
                fill
                style={{ objectFit: 'contain' }}
              />

              {/* Flechas */}
              <button
                onClick={anterior}
                style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                  border: 'none', borderRadius: '50%', width: 48, height: 48,
                  cursor: 'pointer', color: '#fff', fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                ←
              </button>
              <button
                onClick={siguiente}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                  border: 'none', borderRadius: '50%', width: 48, height: 48,
                  cursor: 'pointer', color: '#fff', fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                →
              </button>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {ambienteActivo.fotos.map((foto, i) => (
                <div
                  key={i}
                  onClick={() => setFotoActiva(i)}
                  style={{
                    position: 'relative', flexShrink: 0,
                    width: 72, height: 48,
                    borderRadius: 6, overflow: 'hidden',
                    cursor: 'pointer',
                    border: i === fotoActiva ? '2px solid #fff' : '2px solid transparent',
                    opacity: i === fotoActiva ? 1 : 0.5,
                    transition: 'opacity 0.2s, border 0.2s',
                  }}
                >
                  <Image src={foto} alt={`thumb ${i + 1}`} fill sizes="72px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ambiente-img:hover { transform: scale(1.05); }
        .ambiente-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
        .acceso-card-new:hover { border-color: var(--primary) !important; box-shadow: 0 4px 24px rgba(20,0,140,0.08) !important; }
        .hero-card:hover { background: #14008C !important; }
        .hero-card:hover [data-text] { color: #fff !important; }
        .hero-card:hover [data-arrow] { color: #fff !important; }
        @media (max-width: 900px) {
          .accesos-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .accesos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

function HeroCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="hero-card" style={{ background: 'rgba(250,248,245,0.96)', borderRadius: 8, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div data-text="" style={{ color: '#14008C', flexShrink: 0, transition: 'color 0.2s' }}>{icon}</div>
          <span data-text="" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)', fontWeight: 800, letterSpacing: '0.08em', color: '#0D0D0D', transition: 'color 0.2s' }}>{label}</span>
        </div>
        <span data-arrow="" style={{ fontSize: 20, fontWeight: 700, color: '#14008C', transition: 'color 0.2s' }}>→</span>
      </div>
    </Link>
  )
}