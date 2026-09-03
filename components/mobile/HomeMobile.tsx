'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const AMBIENTES = [
  { key: 'dormitorios', img: '/images/DORMITORIO.png', label: 'DORMITORIOS', fotos: Array.from({length:10},(_,i)=>`/images/inspiracion/dormitorios/${i+1}.jpg`), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 19V9a2 2 0 012-2h16a2 2 0 012 2v10"/><path d="M2 14h20"/><path d="M6 14V9.5a1.5 1.5 0 013 0V14"/><path d="M15 14V9.5a1.5 1.5 0 013 0V14"/><path d="M2 19h20"/><path d="M4 7V5a1 1 0 011-1h14a1 1 0 011 1v2"/></svg> },
  { key: 'oficinas', img: '/images/OFICINA.png', label: 'OFICINAS', fotos: Array.from({length:9},(_,i)=>`/images/inspiracion/oficina/${i+1}.jpg`), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 8h10"/><path d="M7 11h6"/></svg> },
  { key: 'comedores', img: '/images/COMEDOR.png', label: 'COMEDORES', fotos: Array.from({length:10},(_,i)=>`/images/inspiracion/comedor/${i+1}.jpg`), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 6h18"/><path d="M3 6a9 9 0 0018 0"/><path d="M12 6v13"/><path d="M8 19h8"/></svg> },
  { key: 'cocinas', img: '/images/COCINA.png', label: 'COCINAS', fotos: Array.from({length:10},(_,i)=>`/images/inspiracion/cocina/${i+1}.jpg`), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 00-4 0v2"/><circle cx="9" cy="13" r="2"/><path d="M15 11h4"/><path d="M15 15h4"/></svg> },
]

const ACCESOS = [
  { num: '01', titulo: 'Guía de medición', desc: 'Aprendé a tomar las medidas correctas.', href: '/guia-medicion', label: 'VER GUÍA', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 7h18M3 7l2-4h14l2 4M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7"/><path d="M8 7v2M12 7v3M16 7v2"/></svg> },
  { num: '02', titulo: 'Guía de instalación', desc: 'Instalá tu cortina paso a paso.', href: '/guia-instalacion', label: 'VER GUÍA', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> },
  { num: '03', titulo: 'Simulador de luz', desc: 'Comparé Sunscreen vs Blackout en tiempo real.', href: '/simulador', label: 'PROBAR', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> },
  { num: '04', titulo: 'Preguntas frecuentes', desc: 'Respondemos tus dudas antes de comprar.', href: '/faq', label: 'IR A FAQS', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
]

const FOOTER_LINKS = {
  'PRODUCTOS': [{ label: 'Cortinas a medida', href: '/configurador' }, { label: 'Listas para llevar', href: '/stock' }],
  'AYUDA': [{ label: 'Guía de medición', href: '/guia-medicion' }, { label: 'Guía de instalación', href: '/guia-instalacion' }, { label: 'Preguntas frecuentes', href: '/faq' }],
  'INFORMACIÓN': [{ label: 'Quiénes somos', href: '/faq#nosotros' }, { label: 'Envíos', href: '/#' }, { label: 'Cambios y devoluciones', href: '/#' }],
  'CONTACTO': [{ label: 'WhatsApp', href: 'https://wa.me/541133802658' }, { label: 'Email', href: '/#' }],
}

export default function HomeMobile() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ambienteActivo, setAmbienteActivo] = useState<typeof AMBIENTES[0] | null>(null)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [footerAbierto, setFooterAbierto] = useState<string | null>(null)

  const abrirModal = (a: typeof AMBIENTES[0]) => { setAmbienteActivo(a); setFotoActiva(0); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setAmbienteActivo(null) }
  const siguiente = useCallback(() => { if (!ambienteActivo) return; setFotoActiva(i => (i + 1) % ambienteActivo.fotos.length) }, [ambienteActivo])
  const anterior = useCallback(() => { if (!ambienteActivo) return; setFotoActiva(i => (i - 1 + ambienteActivo.fotos.length) % ambienteActivo.fotos.length) }, [ambienteActivo])

  useEffect(() => { document.body.style.overflow = modalAbierto ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modalAbierto])

  return (
    <main style={{ background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: 'calc(100dvh - 64px)', minHeight: 500, overflow: 'hidden' }}>
        <Image src="/images/LIVING.png" alt="Living con cortinas Insumos Roller" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Título */}
        <div style={{ position: 'absolute', top: '38%', left: 0, right: 0, padding: '0 28px', transform: 'translateY(-50%)' }}>
          <h1 style={{ margin: 0, lineHeight: 1.05 }}>
            <span style={{ display: 'block', fontSize: 'clamp(52px,14vw,76px)', fontWeight: 500, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontStyle: 'italic' }}>
              CORTINAS
            </span>
            <span style={{ display: 'block', fontSize: 'clamp(13px,3.5vw,18px)', fontWeight: 500, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.22em', marginTop: 12, fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}>
              QUE TRANSFORMAN TUS{' '}
              <span style={{ color: '#6B8CFF' }}>ESPACIOS</span>
            </span>
          </h1>
        </div>

        {/* CTAs */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 48px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/configurador" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(250,248,245,0.97)', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ color: '#14008C' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', color: '#0D0D0D' }}>CORTINAS A MEDIDA</span>
              </div>
              <span style={{ fontSize: 18, color: '#14008C', fontWeight: 700 }}>→</span>
            </div>
          </Link>
          <Link href="/stock" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(20,0,140,0.85)', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ color: '#fff' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', color: '#fff' }}>LISTAS PARA LLEVAR</span>
              </div>
              <span style={{ fontSize: 18, color: '#fff', fontWeight: 700 }}>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: '#F5F0E8', overflow: 'hidden', height: 48, display: 'flex', alignItems: 'center', borderTop: '1px solid #E8E0D4', borderBottom: '1px solid #E8E0D4' }}>
        <div style={{ display: 'flex', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, rep) => (
            <span key={rep} style={{ display: 'flex', alignItems: 'center' }}>
              {['3 Y 6 CUOTAS SIN INTERÉS', '30% DE DESCUENTO EN EFECTIVO O TRANSFERENCIA'].map((text, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{ color: '#0A0A14', fontWeight: 600, letterSpacing: '0.15em', padding: '0 32px', fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontSize: 13 }}>{text}</span>
                  <span style={{ color: 'rgba(10,10,20,0.2)', fontSize: 9 }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-25%) } }`}</style>
      </div>

      {/* ── GALERÍA AMBIENTES ── */}
      <section style={{ padding: '48px 0 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <p style={{ color: '#14008C', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>INSPIRATE EN ESTOS DISEÑOS</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Descubrí ambientes únicos</h2>
        </div>

        {/* Carrusel horizontal */}
        <div style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: 12, padding: '0 20px 20px', scrollbarWidth: 'none' }}>
          {AMBIENTES.map(a => (
            <div key={a.key} onClick={() => abrirModal(a)} style={{ flexShrink: 0, width: '72vw', scrollSnapAlign: 'start', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                <Image src={a.img} alt={a.label} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#14008C' }}>{a.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', color: '#0A0A14' }}>{a.label}</span>
                </div>
                <span style={{ color: '#14008C', fontWeight: 700 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCESOS RÁPIDOS ── */}
      <section style={{ padding: '40px 0 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Todo lo que necesitás</h2>
        </div>
        <div style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: 12, padding: '0 20px 24px', scrollbarWidth: 'none' }}>
          {ACCESOS.map(a => (
            <Link key={a.titulo} href={a.href} style={{ textDecoration: 'none', flexShrink: 0, width: '72vw', scrollSnapAlign: 'start' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 22px', height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(20,0,140,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14008C', marginBottom: 16 }}>
                  {a.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#14008C', letterSpacing: '0.14em', marginBottom: 8 }}>{a.num}</div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.03em', color: '#0A0A14', marginBottom: 10 }}>{a.titulo}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px 0', flex: 1 }}>{a.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#14008C', letterSpacing: '0.1em' }}>{a.label}</span>
                  <span style={{ color: '#14008C', fontWeight: 700 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#E8E2D9', color: '#0A0A14', padding: '40px 20px 48px', marginTop: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <Image src="/images/LOGO.png" alt="Insumos Roller" width={140} height={52} style={{ objectFit: 'contain', height: 44, width: 'auto' }} />
          <p style={{ fontSize: 13, color: '#8888A8', lineHeight: 1.7, margin: '12px 0 0 0' }}>Fabricación a medida. Envíos a todo el país.</p>
        </div>

        {/* Acordeón footer */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {Object.entries(FOOTER_LINKS).map(([titulo, links]) => (
            <div key={titulo} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <button onClick={() => setFooterAbierto(footerAbierto === titulo ? null : titulo)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase' }}>{titulo}</span>
                <span style={{ color: '#888', fontSize: 18, transition: 'transform 0.2s', transform: footerAbierto === titulo ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {footerAbierto === titulo && (
                <div style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 14, color: '#3D3D5C', textDecoration: 'none', paddingLeft: 4 }}>{l.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#8888A8', margin: '32px 0 0 0', textAlign: 'center' }}>© 2025 Insumos Roller. Todos los derechos reservados.</p>
      </footer>

      {/* ── MODAL GALERÍA ── */}
      {modalAbierto && ambienteActivo && (
        <div onClick={cerrarModal} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column' }}>
          <div onClick={e => e.stopPropagation()} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#fff', opacity: 0.7 }}>{ambienteActivo.icon}</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em' }}>{ambienteActivo.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{fotoActiva + 1}/{ambienteActivo.fotos.length}</span>
              </div>
              <button onClick={cerrarModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 22, opacity: 0.8 }}>✕</button>
            </div>

            {/* Foto */}
            <div style={{ flex: 1, position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#111' }}>
              <Image key={fotoActiva} src={ambienteActivo.fotos[fotoActiva]} alt={`foto ${fotoActiva + 1}`} fill style={{ objectFit: 'contain' }} sizes="100vw" />
              <button onClick={anterior} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
              <button onClick={siguiente} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 0 0', scrollbarWidth: 'none' }}>
              {ambienteActivo.fotos.map((foto, i) => (
                <div key={i} onClick={() => setFotoActiva(i)} style={{ position: 'relative', flexShrink: 0, width: 60, height: 40, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', border: i === fotoActiva ? '2px solid #fff' : '2px solid transparent', opacity: i === fotoActiva ? 1 : 0.45, transition: 'opacity 0.2s' }}>
                  <Image src={foto} alt={`thumb ${i + 1}`} fill sizes="60px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}