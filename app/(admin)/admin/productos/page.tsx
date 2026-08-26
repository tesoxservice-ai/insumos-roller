'use client'

import { useEffect, useState, useCallback } from 'react'

interface TipoCortina {
  id: string
  nombre: string
}

interface Tela {
  id: string
  tipo_id: string
  nombre: string
  descripcion: string
  tooltip: string
  checks: string[]
  imagen_url: string
  activo: boolean
  orden: number
  tipo_cortina?: { nombre: string }
}

interface TelaForm {
  nombre: string
  tipo_id: string
  descripcion: string
  tooltip: string
  checks: string
  activo: boolean
}

const EMPTY_FORM: TelaForm = {
  nombre: '',
  tipo_id: '',
  descripcion: '',
  tooltip: '',
  checks: '',
  activo: true,
}

export default function ProductosPage() {
  const [telas, setTelas] = useState<Tela[]>([])
  const [tipos, setTipos] = useState<TipoCortina[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TelaForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/telas')
      const data = await res.json()
      setTelas(data.telas ?? [])
      setTipos(data.tipos ?? [])
    } catch {
      setError('Error al cargar telas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(tela: Tela) {
    setEditingId(tela.id)
    setForm({
      nombre: tela.nombre,
      tipo_id: tela.tipo_id,
      descripcion: tela.descripcion ?? '',
      tooltip: tela.tooltip ?? '',
      checks: (tela.checks ?? []).join(', '),
      activo: tela.activo,
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleToggle(tela: Tela) {
    try {
      const res = await fetch(`/api/admin/telas/${tela.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !tela.activo }),
      })
      if (!res.ok) throw new Error()
      showFeedback(`Tela ${!tela.activo ? 'activada' : 'desactivada'}`)
      loadData()
    } catch {
      showFeedback('Error al actualizar')
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        checks: form.checks
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      }
      const url = editingId ? `/api/admin/telas/${editingId}` : '/api/admin/telas'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Tela actualizada' : 'Tela creada')
      closeModal()
      loadData()
    } catch {
      showFeedback('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>Telas</h2>
        <button onClick={openCreate} style={btnGold}>+ Nueva tela</button>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : telas.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sin telas cargadas.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Orden', 'Nombre', 'Tipo', 'Activo', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {telas.map((t, i) => (
                <tr key={t.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <td style={tdStyle}>{t.orden}</td>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{t.nombre}</td>
                  <td style={tdStyle}>{t.tipo_cortina?.nombre ?? '—'}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleToggle(t)}
                      style={{
                        background: t.activo ? 'var(--green-soft)' : 'var(--surface2)',
                        color: t.activo ? 'var(--green)' : 'var(--text-muted)',
                        border: 'none', borderRadius: 999, padding: '4px 12px',
                        fontSize: 12, cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => openEdit(t)} style={btnSmall}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? 'Editar tela' : 'Nueva tela'} onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <Field label="Nombre">
              <input style={inputStyle} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </Field>
            <Field label="Tipo">
              <select style={inputStyle} value={form.tipo_id} onChange={e => setForm(f => ({ ...f, tipo_id: e.target.value }))}>
                <option value="">Seleccionar tipo…</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </Field>
            <Field label="Descripción">
              <textarea
                style={{ ...inputStyle, height: 72, resize: 'vertical' }}
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              />
            </Field>
            <Field label="Tooltip">
              <input style={inputStyle} value={form.tooltip} onChange={e => setForm(f => ({ ...f, tooltip: e.target.value }))} />
            </Field>
            <Field label="Checks (separados por coma)">
              <input
                style={inputStyle}
                placeholder="Oscurece 80%, Lavable, Ignífuga"
                value={form.checks}
                onChange={e => setForm(f => ({ ...f, checks: e.target.value }))}
              />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
              Activo
            </label>
            <div className="flex justify-end gap-3 mt-2">
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
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '100%', maxWidth: 480, padding: 28 }}>
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
    <div className="flex flex-col gap-1">
      <label style={{ color: 'var(--text-mid)', fontSize: 13 }}>{label}</label>
      {children}
    </div>
  )
}

const tableWrapper: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', overflowX: 'auto' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, color: 'var(--text-mid)' }
const inputStyle: React.CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', padding: '9px 12px', fontSize: 14, outline: 'none', width: '100%' }
const btnGold: React.CSSProperties = { background: 'var(--gold)', color: '#0F0E0C', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, cursor: 'pointer' }
const btnSmall: React.CSSProperties = { background: 'var(--surface2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: 12, cursor: 'pointer' }
const feedbackStyle: React.CSSProperties = { background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(74,155,111,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }