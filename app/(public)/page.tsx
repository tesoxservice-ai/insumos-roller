'use client'

import Link from 'next/link'

const TELAS = [
  {
    emoji: '☀️',
    nombre: 'Sunscreen',
    desc: 'Luz natural con visión al exterior',
    bg: 'linear-gradient(135deg, #2a1f0a 0%, #3d2e10 100%)',
  },
  {
    emoji: '🌙',
    nombre: 'Blackout',
    desc: 'Oscuridad total y privacidad',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1410 100%)',
  },
  {
    emoji: '✨',
    nombre: 'Doble',
    desc: 'Control de luz y estilo',
    bg: 'linear-gradient(135deg, #151210 0%, #221f1a 100%)',
  },
]

const AMBIENTES = [
  { emoji: '🛏️', label: 'Dormitorios' },
  { emoji: '🛋️', label: 'Livings' },
  { emoji: '💼', label: 'Oficinas' },
  { emoji: '🍽️', label: 'Comedores' },
]

const PROYECTOS = [
  {
    emoji: '🏠',
    nombre: 'Departamento en Palermo',
    desc: 'Blackout gris en 3 dormitorios + sunscreen en living.',
  },
  {
    emoji: '🏢',
    nombre: 'Oficina corporativa',
    desc: 'Sistema doble motorizado en 12 ventanas de planta abierta.',
  },
  {
    emoji: '🏡',
    nombre: 'Casa en Nordelta',
    desc: 'Verticales en living + roller blackout en 4 ambientes.',
  },
]

export default function HomePage() {
  const waNumero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waMensaje = encodeURIComponent('Hola! Me gustaría recibir asesoramiento sobre cortinas roller.')
  const waUrl = `https://wa.me/${waNumero}?text=${waMensaje}`

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ─── SECCIÓN 1: HERO ──────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center pt-16"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 100% 0%, rgba(201,168,76,0.08) 0%, transparent 70%), var(--bg)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full py-16 flex flex-col md:flex-row items-center gap-12">

          {/* Texto izquierda */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Eyebrow */}
            <span
              className="self-start text-xs font-semibold px-4 py-1.5"
              style={{
                backgroundColor: 'var(--gold-soft)',
                border: '1px solid var(--gold-border)',
                color: 'var(--gold)',
                borderRadius: '100px',
              }}
            >
              ✦ Fabricación a medida · Envíos a todo el país
            </span>

            {/* H1 */}
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: 'var(--text)' }}
            >
              Encontrá la cortina perfecta para tu{' '}
              <span style={{ color: 'var(--gold)' }}>espacio.</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg max-w-lg" style={{ color: 'var(--text-mid)' }}>
              Diseñala a medida o elegí entre nuestras opciones listas para llevar.
            </p>

            {/* Cards de acción */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {/* Card a medida */}
              <Link
                href="/configurador"
                className="flex-1 flex flex-col gap-3 p-5 rounded-2xl border transition-all hover:border-yellow-500/50 group"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <span className="text-2xl">📐</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    Cortinas a medida
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Configurá cada detalle a tu gusto y espacio.
                  </p>
                </div>
                <span
                  className="text-sm font-semibold mt-auto"
                  style={{ color: 'var(--gold)' }}
                >
                  Configurar mi cortina →
                </span>
              </Link>

              {/* Card stock */}
              <Link
                href="/stock"
                className="flex-1 flex flex-col gap-3 p-5 rounded-2xl border transition-all hover:border-yellow-500/50"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    Listas para llevar
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Stock disponible con envío inmediato.
                  </p>
                </div>
                <span
                  className="text-sm font-semibold mt-auto"
                  style={{ color: 'var(--gold)' }}
                >
                  Ver productos →
                </span>
              </Link>
            </div>
          </div>

          {/* Ilustración derecha — solo desktop */}
          <div
            className="hidden md:flex items-center justify-center rounded-3xl overflow-hidden flex-shrink-0"
            style={{
              width: '380px',
              height: '420px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <svg viewBox="0 0 380 420" fill="none" xmlns="http://www.w3.org/2000/svg" width="380" height="420">
              {/* Pared fondo */}
              <rect width="380" height="420" fill="#1a1610"/>
              {/* Piso */}
              <rect y="310" width="380" height="110" fill="#140f0a"/>
              {/* Ventana grande */}
              <rect x="50" y="40" width="200" height="230" rx="4" fill="#0a0f1a" stroke="#2E2A24" strokeWidth="2"/>
              {/* Luz entrando */}
              <rect x="53" y="43" width="194" height="224" fill="#e8d5a0" opacity="0.06"/>
              {/* Cortina roller */}
              <rect x="48" y="36" width="204" height="10" rx="3" fill="#C9A84C" opacity="0.7"/>
              <rect x="53" y="46" width="194" height="160" fill="#221f1a" opacity="0.85"/>
              {/* Sillón */}
              <rect x="180" y="255" width="160" height="55" rx="12" fill="#2a2218"/>
              <rect x="170" y="240" width="180" height="30" rx="10" fill="#332a1c"/>
              <rect x="170" y="255" width="18" height="55" rx="6" fill="#2a2218"/>
              <rect x="332" y="255" width="18" height="55" rx="6" fill="#2a2218"/>
              {/* Planta */}
              <rect x="290" y="250" width="16" height="60" rx="4" fill="#1a1208"/>
              <ellipse cx="298" cy="240" rx="28" ry="32" fill="#1e3d1e" opacity="0.9"/>
              <ellipse cx="312" cy="230" rx="18" ry="22" fill="#234a23" opacity="0.8"/>
              <ellipse cx="280" cy="235" rx="15" ry="20" fill="#1a3a1a" opacity="0.7"/>
              {/* Lámpara de pie */}
              <rect x="88" y="190" width="6" height="110" rx="2" fill="#2E2A24"/>
              <ellipse cx="91" cy="188" rx="24" ry="12" fill="#332a1c"/>
              <ellipse cx="91" cy="192" rx="18" ry="8" fill="#C9A84C" opacity="0.25"/>
              {/* Mesa lateral */}
              <rect x="60" y="285" width="50" height="8" rx="3" fill="#2a2218"/>
              <rect x="70" y="293" width="6" height="20" rx="2" fill="#221a12"/>
              <rect x="94" y="293" width="6" height="20" rx="2" fill="#221a12"/>
              {/* Luz cálida ambiente */}
              <ellipse cx="91" cy="200" rx="60" ry="40" fill="#C9A84C" opacity="0.04"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 2: TIPOS DE TELA ─────────────────────────── */}
      <section
        id="productos"
        className="border-t py-20"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12 items-start">

          {/* Texto izquierda */}
          <div className="flex flex-col gap-4 md:w-80 flex-shrink-0">
            <span
              className="self-start text-xs font-semibold px-3 py-1"
              style={{
                backgroundColor: 'var(--gold-soft)',
                border: '1px solid var(--gold-border)',
                color: 'var(--gold)',
                borderRadius: '100px',
              }}
            >
              ✦ ¿No sabés cuál elegir?
            </span>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              Te ayudamos a elegir.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
              Descubrí el tipo ideal según la luz que necesitás para tu ambiente.
            </p>
            <Link
              href="/configurador"
              className="self-start text-sm font-semibold mt-2 transition-opacity hover:opacity-80"
              style={{ color: 'var(--gold)' }}
            >
              Probar simulador de luz →
            </Link>
          </div>

          {/* Cards telas */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {TELAS.map((tela) => (
              <Link
                key={tela.nombre}
                href="/configurador"
                className="rounded-2xl p-5 border flex flex-col gap-3 transition-all hover:border-yellow-500/40"
                style={{
                  background: tela.bg,
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <span className="text-3xl">{tela.emoji}</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {tela.nombre}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {tela.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 3: GALERÍA DE AMBIENTES ─────────────────── */}
      <section
        id="inspiracion"
        className="border-t py-20"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="flex flex-col gap-2">
              <span
                className="self-start text-xs font-semibold px-3 py-1"
                style={{
                  backgroundColor: 'var(--gold-soft)',
                  border: '1px solid var(--gold-border)',
                  color: 'var(--gold)',
                  borderRadius: '100px',
                }}
              >
                ✦ Inspiración para tu hogar
              </span>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Así puede quedar tu espacio.
              </h2>
            </div>
            <Link
              href="/configurador"
              className="text-sm font-semibold transition-opacity hover:opacity-80 self-start md:self-auto"
              style={{ color: 'var(--gold)' }}
            >
              Ver catálogo →
            </Link>
          </div>

          {/* Grilla ambientes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AMBIENTES.map((amb) => (
              <Link
                key={amb.label}
                href="/configurador"
                className="relative rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] duration-200 cursor-pointer"
                style={{
                  aspectRatio: '3/4',
                  backgroundColor: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                {/* Emoji centrado */}
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  {amb.emoji}
                </div>
                {/* Label con gradiente */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {amb.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 4: GALERÍA DE PROYECTOS ─────────────────── */}
      <section
        className="border-t py-20"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-2 mb-10">
            <span
              className="self-start text-xs font-semibold px-3 py-1"
              style={{
                backgroundColor: 'var(--gold-soft)',
                border: '1px solid var(--gold-border)',
                color: 'var(--gold)',
                borderRadius: '100px',
              }}
            >
              ✦ Trabajos realizados
            </span>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              Proyectos reales.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROYECTOS.map((p) => (
              <div
                key={p.nombre}
                className="rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                {/* Área imagen */}
                <div
                  className="flex items-center justify-center text-5xl"
                  style={{
                    height: '160px',
                    backgroundColor: 'var(--surface2)',
                  }}
                >
                  {p.emoji}
                </div>
                {/* Body */}
                <div className="p-5">
                  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {p.nombre}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 5: ACCESOS RÁPIDOS ──────────────────────── */}
      <section
        id="guias"
        className="border-t py-16"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Guía medición */}
            <Link
              href="/guia-medicion"
              className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:border-yellow-500/40 group"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <span className="text-3xl flex-shrink-0">📏</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  Guía de medición
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Aprendé a medir tu ventana paso a paso.
                </p>
              </div>
              <span className="text-lg flex-shrink-0" style={{ color: 'var(--text-muted)' }}>→</span>
            </Link>

            {/* Guía instalación */}
            <Link
              href="/guia-instalacion"
              className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:border-yellow-500/40"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <span className="text-3xl flex-shrink-0">🔧</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  Cómo instalar
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Tutoriales y consejos para una instalación perfecta.
                </p>
              </div>
              <span className="text-lg flex-shrink-0" style={{ color: 'var(--text-muted)' }}>→</span>
            </Link>

            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:border-yellow-500/40"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <span className="text-3xl flex-shrink-0">💬</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  ¿Tenés dudas?
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Hablá con nuestro equipo de asesores.
                </p>
              </div>
              <span className="text-lg flex-shrink-0" style={{ color: 'var(--text-muted)' }}>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
