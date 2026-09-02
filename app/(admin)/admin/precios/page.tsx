'use client'

import { useEffect, useState, useCallback } from 'react'

interface ReglaPrecio {
  id: string
  tela_id: string
  motorizada_extra: number
  instalacion_extra: number
  tela?: { nombre: string }
}

interface PrecioForm {
  motorizada_extra: string
  instalacion_extra: string
}

const ar = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function PreciosPage() {
  const [reglas, setReglas] = useState<ReglaPrecio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PrecioForm>({ motorizada_extra: '', instalacion_extra: '' })
  const [saving, setSaving] = useState(false)

  const showFeedback = (msg: string, ok = true) => { setFeedback({ msg, ok }); setTimeout(() => setFeedback(null), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/precios')
      const data = await res.json()
      setReglas(data.reglas ?? [])
    } catch { setError('Error al cargar precios') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openEdit(r: ReglaPrecio) {
    setEditingId(r.id)
    setForm({ motorizada_extra: String(r.motorizada_extra), instalacion_extra: String(r.instalacion_extra) })
  }
  function closeModal() { setEditingId(null); setForm({ motorizada_extra: '', instalacion_extra: '' }) }

  async function handleSave() {
    if (!editingId) return
    const regla = reglas.find(r => r.id === editingId)
    if (!regla) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/precios/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tela_id: regla.tela_id,
          precio_m2: (regla as any).precio_m2 ?? 0,
          motorizada_extra: Number(form.motorizada_extra),
          instalacion_extra: Number(form.instalacion_extra),
          minimo_ancho: (regla as any).minimo_ancho ?? 0,
          maximo_ancho: (regla as any).maximo_ancho ?? 0,
          minimo_alto: (regla as any).minimo_alto ?? 0,
          maximo_alto: (regla as any).maximo_alto ?? 0,
        }),
      })
      if (!res.ok) throw new Error()
      showFeedback('Precios actualizados')
      closeModal(); loadData()
    } catch { showFeedback('Error al guardar', false) }
    finally { setSaving(false) }
  }

  const editingRegla = reglas.find(r => r.id === editingId) ?? null

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>Precios</h1>
        <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0 0' }}>Extras que se suman al presupuesto de cada pedido.</p>
      </div>

      {feedback && (
        <div style={{ borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 16, background: feedback.ok ? '#EDFDF4' : '#FEF2F2', color: feedback.ok ? '#16A34A' : '#DC2626', border: `1px solid ${feedback.ok ? '#BBF7D0' : '#FECACA'}` }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Cargando…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', fontSize: 14 }}>{error}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Tela', 'Extra motorizada', 'Extra instalación profesional', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600, borderBottom: '1px solid #EAECF0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reglas.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < reglas.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{r.tela?.nombre ?? '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#555' }}>{ar(r.motorizada_extra)}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#555' }}>{ar(r.instalacion_extra)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => openEdit(r)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      border: '1px solid #EAECF0', background: '#fff', color: '#1500CC', cursor: 'pointer',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingId && editingRegla && (
        <Modal title={`Editar extras — ${editingRegla.tela?.nombre ?? ''}`} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Extra motorizada ($)">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14 }}>$</span>
                <input type="number" style={{ ...inputStyle, paddingLeft: 28 }} value={form.motorizada_extra} onChange={e => setForm(f => ({ ...f, motorizada_extra: e.target.value }))} />
              </div>
            </Field>
            <Field label="Extra instalación profesional ($)">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14 }}>$</span>
                <input type="number" style={{ ...inputStyle, paddingLeft: 28 }} value={form.instalacion_extra} onChange={e => setForm(f => ({ ...f, instalacion_extra: e.target.value }))} />
              </div>
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 20 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{label}</label>{children}</div>
}

const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#FAFAFA' }
const btnPrimary: React.CSSProperties = { background: '#1500CC', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: '#fff', color: '#555', border: '1px solid #EAECF0', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }