'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Metrics {
  telas: number
  colores: number
  stock: number
  stockSinFoto: number
}

const METRIC_CARDS = (m: Metrics) => [
  {
    label: 'Telas activas', value: m.telas, href: '/admin/productos',
    iconBg: '#EEF0FF', iconColor: '#1500CC',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    linkLabel: 'Ver telas',
  },
  {
    label: 'Colores activos', value: m.colores, href: '/admin/colores',
    iconBg: '#F0EEFF', iconColor: '#7C3AED',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/><path d="M2 12h20"/></svg>,
    linkLabel: 'Ver colores',
  },
  {
    label: 'Productos en stock', value: m.stock, href: '/admin/stock',
    iconBg: '#FFF3E8', iconColor: '#EA6A1E',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    linkLabel: 'Ver stock',
  },
  {
    label: 'Sin foto', value: m.stockSinFoto, href: '/admin/stock',
    iconBg: '#EDFDF4', iconColor: '#16A34A',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    linkLabel: 'Ver productos',
    warn: m.stockSinFoto > 0,
  },
]

const ACCESOS = [
  { href: '/admin/colores', label: 'Gestionar colores', sub: 'Editar y agregar colores', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/><path d="M2 12h20"/></svg> },
  { href: '/admin/precios', label: 'Actualizar precios', sub: 'Modificar precios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { href: '/admin/stock', label: 'Ver stock', sub: 'Revisar inventario', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
  { href: '/admin/faq', label: 'Ver FAQ', sub: 'Preguntas frecuentes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
]

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>
            ¡Bienvenido, Admin! 👋
          </h1>
          <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0 0' }}>
            Aquí tenés un resumen general de tu inventario y configuración.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #EAECF0', borderRadius: 12, padding: '8px 16px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1500CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>A</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', margin: 0 }}>Admin</p>
            <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Administrador</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, padding: 24, height: 140 }} />
          ))}
        </div>
      ) : metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {METRIC_CARDS(metrics).map(card => (
            <div key={card.label} style={{
              background: '#fff',
              border: `1px solid ${card.warn ? 'rgba(234,179,8,0.3)' : '#EAECF0'}`,
              borderRadius: 16, padding: 24,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.iconColor }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.iconColor, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{card.label}</div>
              </div>
              <Link href={card.href} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: card.iconColor, textDecoration: 'none' }}>
                {card.linkLabel} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF0FF 0%, #F5F0FF 100%)',
        borderRadius: 20, padding: '40px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ maxWidth: 420, zIndex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D0D0D', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            Gestioná tu inventario<br />
            de forma <span style={{ color: '#1500CC' }}>simple y eficiente</span>
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            Desde aquí podés administrar colores, precios, stock y mantener tu catálogo siempre actualizado.
          </p>
          <Link href="/admin/stock" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1500CC', color: '#fff',
            padding: '12px 24px', borderRadius: 10,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}>
            Comenzar ahora →
          </Link>
        </div>
        <div style={{ position: 'relative', width: 320, height: 220, flexShrink: 0 }}>
          <Image
            src="/images/ROLLER.png"
            alt="Cortina Roller"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Accesos rápidos */}
        <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', margin: '0 0 20px 0' }}>Accesos rápidos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {ACCESOS.map(a => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderRadius: 12,
                  border: '1px solid #EAECF0', background: '#FAFAFA',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1500CC'; e.currentTarget.style.background = '#F5F5FF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#EAECF0'; e.currentTarget.style.background = '#FAFAFA' }}
                >
                  <span style={{ color: '#1500CC', marginTop: 1, flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1500CC', margin: 0 }}>{a.label}</p>
                    <p style={{ fontSize: 12, color: '#999', margin: '2px 0 0 0' }}>{a.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>Actividad reciente</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA6A1E" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, bg: '#FFF3E8', text: 'Gestioná el stock desde la sección Stock', time: '' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/><path d="M2 12h20"/></svg>, bg: '#F0EEFF', text: 'Administrá los colores del catálogo', time: '' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1500CC" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, bg: '#EEF0FF', text: 'Actualizá los precios cuando sea necesario', time: '' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: 13, color: '#555', margin: 0, flex: 1 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}