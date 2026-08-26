'use client'

import React, { useEffect, useState, useCallback } from 'react'
import type { Cotizacion } from '@/types'

const ESTADOS = ['todos', 'pendiente', 'enviada', 'aceptada', 'rechazada'] as const
type Estado = typeof ESTADOS[number]

const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  pendiente: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  enviada: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  aceptada: { bg: 'rgba(74,155,111,0.15)', color: '#4a9b6f' },
  rechazada: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<Estado>('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = filtro !== 'todos'
        ? `/api/admin/cotizaciones?estado=${filtro}`
        : '/api/admin/cotizaciones'
      const res = await fetch(url)
      const data = await res.json()
      setCotizaciones(data.cotizaciones ?? [])
    } catch {
      setError('Error al cargar cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [filtro])

  useEffect(() => { loadData() }, [loadData])

  async function handleEstado(id: string, nuevoEstado: string) {
    try {
      const res = await fetch(`/api/admin/cotizaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
      showFeedback('Estado actualizado')
      loadData()
    } catch {
      showFeedback('Error al actualizar estado')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>Cotizaciones</h2>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      <div className="flex gap-2 mb-6 flex-wrap">
        {ESTADOS.map(e => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            style={{
              background: filtro === e ? 'var(--gold-soft)' : 'var(--surface)',
              color: filtro === e ? 'var(--gold)' : 'var(--text-mid)',
              border: `1px solid ${filtro === e ? 'var(--gold-border)' : 'var(--border)'}`,
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: filtro === e ? 600 : 400,
            }}
          >
            {e === 'todos' ? 'Todos' : e}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : cotizaciones.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sin cotizaciones.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Fecha', 'Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Instal.', 'Precio', 'Email', 'Estado', ''].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((c, i) => {
                const estado = c.estado ?? 'pendiente'
                const chip = ESTADO_COLORS[estado] ?? { bg: 'var(--surface2)', color: 'var(--text-mid)' }
                const isExpanded = expandedId === c.id
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      style={{
                        borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                        cursor: 'pointer',
                        background: isExpanded ? 'var(--surface2)' : undefined,
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    >
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        {new Date(c.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td style={tdStyle}>{c.tipo}</td>
                      <td style={tdStyle}>{c.tela}</td>
                      <td style={tdStyle}>{c.color}</td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{c.ancho_cm}×{c.alto_cm}</td>
                      <td style={tdStyle}>{c.sistema}</td>
                      <td style={tdStyle}>{c.con_instalacion ? '✓' : '—'}</td>
                      <td style={{ ...tdStyle, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                        ${(c.precio_estimado ?? 0).toLocaleString('es-AR')}
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12 }}>{c.email_cliente ?? '—'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          background: chip.bg, color: chip.color,
                          borderRadius: 999, padding: '3px 10px', fontSize: 12,
                          fontWeight: 500, textTransform: 'capitalize',
                        }}>
                          {estado}
                        </span>
                      </td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}>
                        <select
                          value={estado}
                          onChange={e => handleEstado(c.id, e.target.value)}
                          style={{
                            background: 'var(--surface2)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)', color: 'var(--text-mid)',
                            padding: '4px 8px', fontSize: 12, cursor: 'pointer',
                          }}
                        >
                          {['pendiente', 'enviada', 'aceptada', 'rechazada'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={11} style={{ padding: '16px 20px', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
                          <div style={{ color: 'var(--text-mid)', fontSize: 13 }}>
                            <strong style={{ color: 'var(--text)' }}>Detalle completo</strong>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                              <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Sistema</span>{c.sistema ?? '—'}</div>
                              <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Instalación</span>{c.con_instalacion ? 'Sí' : 'No'}</div>
                              <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Email</span>{c.email_cliente ?? '—'}</div>
                              <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Fecha</span>{new Date(c.created_at).toLocaleString('es-AR')}</div>
                            </div>
                            {c.items && Array.isArray(c.items) && c.items.length > 0 && (
                              <div style={{ marginTop: 16 }}>
                                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 8 }}>Items del presupuesto</strong>
                                {(c.items as Record<string, unknown>[]).map((item, idx) => (
                                  <div key={idx} style={{
                                    background: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 8,
                                  }}>
                                    <pre style={{ margin: 0, fontSize: 12, color: 'var(--text-mid)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                      {JSON.stringify(item, null, 2)}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const tableWrapper: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', overflowX: 'auto' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, color: 'var(--text-mid)' }
const feedbackStyle: React.CSSProperties = { background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(74,155,111,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }