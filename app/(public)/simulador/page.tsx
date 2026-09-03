'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function SimuladorPage() {
  const [posicion, setPosicion] = useState(50)
  const isMobile = useIsMobile()
  const [arrastrando, setArrastrando] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const calcularPosicionImagen = useCallback((clientX: number) => {
    const rect = contenedorRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    setPosicion(Math.max(0, Math.min(100, (x / rect.width) * 100)))
  }, [])

  const calcularPosicionSlider = useCallback((clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    setPosicion(Math.max(0, Math.min(100, (x / rect.width) * 100)))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!arrastrando) return
    calcularPosicionSlider(e.clientX)
  }, [arrastrando, calcularPosicionSlider])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!arrastrando) return
    calcularPosicionSlider(e.touches[0].clientX)
  }, [arrastrando, calcularPosicionSlider])

  const onEnd = useCallback(() => setArrastrando(false), [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [onMouseMove, onTouchMove, onEnd])

  const porcentajeSunscreen = Math.round((1 - posicion / 100) * 100)
  const porcentajeBlackout = Math.round((posicion / 100) * 100)
  const esBlackout = posicion > 50

  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingTop: 80 }}>

      {/* HEADER */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 48px 48px' }}>
        <h1 style={{
          fontSize: 'clamp(48px, 5.5vw, 76px)',
          fontWeight: 300,
          color: '#0A0A14',
          letterSpacing: '-0.01em',
          margin: '0 0 20px 0',
          fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
          fontStyle: 'italic',
          lineHeight: 1.05,
        }}>
          Simulador de luz
        </h1>
        <div style={{ width: 40, height: 2.5, background: '#14008C', borderRadius: 2, marginBottom: 24 }} />
        <p style={{ fontSize: 18, color: '#8888A8', margin: 0, maxWidth: 560, lineHeight: 1.7, fontWeight: 400, fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}>
          Arrastrá el slider para ver cómo cambia tu ambiente con Sunscreen y Blackout.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 80px' }}>

        {/* IMAGEN */}
        <div
          ref={contenedorRef}
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            aspectRatio: isMobile ? '4/3' : '16/9',
            boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
            cursor: 'crosshair',
            border: '1px solid #EBEBEB',
          }}
          onClick={e => calcularPosicionImagen(e.clientX)}
        >
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image src="/images/simulador-blackout.png" alt="Blackout" fill style={{ objectFit: 'cover' }} priority />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            clipPath: `inset(0 ${posicion}% 0 0)`,
            transition: arrastrando ? 'none' : 'clip-path 0.05s',
          }}>
            <Image src="/images/simulador-sunscreen.png" alt="Sunscreen" fill style={{ objectFit: 'cover' }} priority />
          </div>
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${100 - posicion}%`,
            transform: 'translateX(-50%)',
            width: 2,
            background: '#fff',
            boxShadow: '0 0 12px rgba(255,255,255,0.5)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* SLIDER */}
        <div style={{ marginTop: 32, marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#14008C', letterSpacing: '0.06em' }}>
              ← SUNSCREEN ({porcentajeSunscreen}%)
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0A0A14', letterSpacing: '0.06em' }}>
              BLACKOUT ({porcentajeBlackout}%) →
            </span>
          </div>
          <div
            ref={sliderRef}
            style={{
              position: 'relative', height: 8, borderRadius: 100,
              background: 'linear-gradient(to right, rgba(20,0,140,0.12), #0A0A14)',
              cursor: 'pointer',
            }}
            onClick={e => calcularPosicionSlider(e.clientX)}
          >
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${posicion}%`, borderRadius: 100,
              background: 'linear-gradient(to right, #14008C, #3D3D5C)',
              transition: arrastrando ? 'none' : 'width 0.05s',
            }} />
            <div
              style={{
                position: 'absolute', top: '50%', left: `${posicion}%`,
                transform: 'translate(-50%, -50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: '#fff', border: '2.5px solid #14008C',
                boxShadow: '0 2px 16px rgba(20,0,140,0.2)',
                cursor: arrastrando ? 'grabbing' : 'grab',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: arrastrando ? 'none' : 'left 0.05s',
              }}
              onMouseDown={e => { e.preventDefault(); setArrastrando(true) }}
              onTouchStart={e => { setArrastrando(true); calcularPosicionSlider(e.touches[0].clientX) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14008C" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l-6-6 6-6"/><path d="M15 6l6 6-6 6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="info-grid">

          {/* Sunscreen */}
          <div style={{
            border: `1.5px solid ${!esBlackout ? '#C8B89A' : '#E8E4DC'}`,
            borderRadius: 20,
            padding: '40px 40px',
            background: '#FAF8F5',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F0EBE3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9A7E5A" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A2E', margin: 0, letterSpacing: '0.08em', fontFamily: 'var(--font-cormorant), serif' }}>SUNSCREEN</h2>
                <p style={{ fontSize: 15, color: '#9A7E5A', margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-cormorant), serif' }}>Luz natural, sin perder tu vista.</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, margin: '28px 0' }}>
              <div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#1A1A2E', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-cormorant), serif' }}>70%</div>
                <div style={{ fontSize: 11, color: '#AAA', letterSpacing: '0.12em', marginTop: 4 }}>LUZ FILTRADA</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i <= 2 ? '#9A7E5A' : 'transparent', border: '1.5px solid #9A7E5A' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#AAA', letterSpacing: '0.12em', marginTop: 6 }}>PRIVACIDAD</div>
              </div>
            </div>

            {/* Checks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Reduce el deslumbramiento', 'Mantiene la vista al exterior', 'Protege tus muebles y pisos', 'Mejora la eficiencia energética'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A7E5A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 15, color: '#555', fontFamily: 'var(--font-cormorant), serif' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Botón */}
            <Link href="/configurador" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1.5px solid #9A7E5A', borderRadius: 10,
              padding: '14px 22px', textDecoration: 'none', marginTop: 'auto',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#9A7E5A' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-cormorant), serif', letterSpacing: '0.04em' }}>Explorar Sunscreen</span>
              <span style={{ color: '#9A7E5A', fontSize: 18 }}>→</span>
            </Link>
          </div>

          {/* Blackout */}
          <div style={{
            border: 'none',
            borderRadius: 20,
            padding: '40px 40px',
            background: '#1A1A2E',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '0.08em', fontFamily: 'var(--font-cormorant), serif' }}>BLACKOUT</h2>
                <p style={{ fontSize: 15, color: '#C8B89A', margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-cormorant), serif' }}>Oscuridad y privacidad total.</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, margin: '28px 0' }}>
              <div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-cormorant), serif' }}>99%</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 4 }}>BLOQUEO DE LUZ</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#C8B89A', border: '1.5px solid #C8B89A' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 6 }}>PRIVACIDAD</div>
              </div>
            </div>

            {/* Checks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Oscuridad total garantizada', 'Máxima privacidad', 'Ideal para dormitorios y home theater', 'Aislamiento térmico y acústico'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-cormorant), serif' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Botón */}
            <Link href="/configurador" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1.5px solid #C8B89A', borderRadius: 10,
              padding: '14px 22px', textDecoration: 'none', marginTop: 'auto',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,184,154,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-cormorant), serif', letterSpacing: '0.04em' }}>Explorar Blackout</span>
              <span style={{ color: '#C8B89A', fontSize: 18 }}>→</span>
            </Link>
          </div>
        </div>
</div>

      <style>{`
        @media (max-width: 768px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}