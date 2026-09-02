'use client'

import { useEffect, useState, useCallback } from 'react'

interface ReglaPrecio {
  id: string
  tela_id: string
  precio_m2: number
  motorizada_extra: number
  instalacion_extra: number
  minimo_ancho: number
  maximo_ancho: number
  minimo_alto: number
  maximo_alto: number
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
  const [feedback, setFeedback] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PrecioForm>({ motorizada_extra: '', instalacion_extra: '' })
  const [saving, setSaving] = useState(false)

  const showFeedback = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(null), 3000) }

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
    setForm({
      motorizada_extra: String(r.motorizada_extra),
      instalacion_extra: String(r.instalacion_extra),
    })
  }

  function closeModal() { setEditingId(null); setForm({ motorizada_extra: '', instalacion_extra: '' }) }

  async function handleSave() {
    if (!editingId) return
    const regla = reglas.find(r => r.id === editingId)
    if (!regla) return
    setSaving(true)
    try {
      const payload = {
        tela_id: regla.tela_id,
        precio_m2: regla.precio_m2,
        motorizada_extra: Number(form.motorizada_extra),
        instalacion_extra: Number(form.instalacion_extra),
        minimo_ancho: regla.minimo_ancho,
        maximo_ancho: regla.maximo_ancho,
        minimo_alto: regla.minimo_alto,
        maximo_alto: regla.maximo_alto,
      }
      const res = await fetch(`/api/admin/precios/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      showFeedback('Precios actualizados')
      closeModal()
      loadData()
    } catch { showFeedback('Error al guardar') }
    finally { setSaving(false) }
  }

  const editingRegla = reglas.find(r => r.id === editingId) ?? null

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, margin: 0 }}>Precios</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0 0' }}>
          Extras que se suman al presupuesto de cada pedido.
        </p>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Tela', 'Extra motorizada', 'Extra instalación profesional', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reglas.map((r, i) => (
                <tr key={r.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 600 }}>{r.tela?.nombre ?? '—'}</td>
                  <td style={tdStyle}>{ar(r.motorizada_extra)}</td>
                  <td style={tdStyle}>{ar(r.instalacion_extra)}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openEdit(r)} style={btnSmall}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && editingRegla && (
        <Modal title={`Editar extras — ${editingRegla.tela?.nombre ?? ''}`} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Extra motorizada ($)">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                <input
                  type="number"
                  style={{ ...inputStyle, paddingLeft: 24 }}
                  value={form.motorizada_extra}
                  onChange={e => setForm(f => ({ ...f, motorizada_extra: e.target.value }))}
                />
              </div>
            </Field>
            <Field label="Extra instalación profesional ($)">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                <input
                  type="number"
                  style={{ ...inputStyle, paddingLeft: 24 }}
                  value={form.instalacion_extra}
                  onChange={e => setForm(f => ({ ...f, instalacion_extra: e.target.value }))}
                />
              </div>
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnGold}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '100%', maxWidth: 400, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ color: 'var(--text-mid)', fontSize: 13 }}>{label}</label>
      {children}
    </div>
  )
}

const tableWrapper: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14, color: 'var(--text-mid)' }
const inputStyle: React.CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', padding: '9px 12px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }
const btnGold: React.CSSProperties = { background: 'var(--gold)', color: '#0F0E0C', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, cursor: 'pointer' }
const btnSmall: React.CSSProperties = { background: 'var(--surface2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: 12, cursor: 'pointer' }
const feedbackStyle: React.CSSProperties = { background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(74,155,111,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }