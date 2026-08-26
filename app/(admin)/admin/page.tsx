'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Cotizacion } from '@/types'

interface Metrics {
  telas: number
  colores: number
  stock: number
  cotizaciones: number
}

const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  pendiente: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  enviada: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  aceptada: { bg: 'rgba(74,155,111,0.15)', color: '#4a9b6f' },
  rechazada: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [recientes, setRecientes] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const [
          { count: telas },
          { count: colores },
          { count: stock },
          { count: cotizaciones },
          { data: ultimas, error: err },
        ] = await Promise.all([
          supabase.from('tela').select('*', { count: 'exact', head: true }).eq('activo', true),
          supabase.from('color').select('*', { count: 'exact', head: true }).eq('activo', true),
          supabase.from('producto_stock').select('*', { count: 'exact', head: true }).eq('activo', true),
          supabase.from('cotizacion').select('*', { count: 'exact', head: true }),
          supabase
            .from('cotizacion')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (err) throw err

        setMetrics({
          telas: telas ?? 0,
          colores: colores ?? 0,
          stock: stock ?? 0,
          cotizaciones: cotizaciones ?? 0,
        })
        setRecientes((ultimas as Cotizacion[]) ?? [])
      } catch {
        setError('Error al cargar datos del dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando dashboard…</p>
  }
  if (error) {
    return <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
  }

  return (
    <div>
      <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Dashboard
      </h2>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Telas activas', value: metrics!.telas, icon: '🧵' },
          { label: 'Colores activos', value: metrics!.colores, icon: '🎨' },
          { label: 'Productos en stock', value: metrics!.stock, icon: '📦' },
          { label: 'Cotizaciones', value: metrics!.cotizaciones, icon: '📋' },
        ].map(m => (
          <div
            key={m.label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ color: 'var(--gold)', fontSize: 28, fontWeight: 700 }}>{m.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Últimas cotizaciones */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>
            Últimas cotizaciones
          </h3>
        </div>

        {recientes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20 }}>
            Sin cotizaciones aún.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)' }}>
                  {['Fecha', 'Tipo', 'Tela', 'Color', 'Medidas', 'Precio est.', 'Estado'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recientes.map((c, i) => {
                  const estado = c.estado ?? 'pendiente'
                  const chip = ESTADO_COLORS[estado] ?? { bg: 'var(--surface2)', color: 'var(--text-mid)' }
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-mid)', whiteSpace: 'nowrap' }}>
                        {new Date(c.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{c.tipo}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{c.tela}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{c.color}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-mid)', whiteSpace: 'nowrap' }}>
                        {c.ancho_cm} × {c.alto_cm} cm
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                        ${(c.precio_estimado ?? 0).toLocaleString('es-AR')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            background: chip.bg,
                            color: chip.color,
                            borderRadius: 999,
                            padding: '3px 10px',
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        >
                          {estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}