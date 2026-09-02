'use client'

import { useEffect, useState, useCallback } from 'react'

interface Tela { id: string; nombre: string }
interface Color {
  id: string
  tela_id: string
  nombre: string
  hex: string
  activo: boolean
  orden: number
  tela?: { nombre: string }
}
interface ColorForm {
  tela_id: string
  nombre: string
  hex: string
  activo: boolean
}

const EMPTY_FORM: ColorForm = { tela_id: '', nombre: '', hex: '#C9A84C', activo: true }

export default function ColoresPage() {
  const [colores, setColores] = useState<Color[]>([])
  const [telas, setTelas] = useState<Tela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ColorForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [cRes, tRes] = await Promise.all([
        fetch('/api/admin/colores'),
        fetch('/api/admin/telas'),
      ])
      const cData = await cRes.json()
      const tData = await tRes.json()
      setColores(cData.colores ?? [])
      setTelas(tData.telas ?? [])
    } catch {
      setError('Error al cargar colores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  function openEdit(c: Color) {
    setEditingId(c.id)
    setForm({ tela_id: c.tela_id, nombre: c.nombre, hex: c.hex, activo: c.activo })
    setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleToggle(c: Color) {
    try {
      const res = await fetch(`/api/admin/colores/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !c.activo }),
      })
      if (!res.ok) throw new Error()
      showFeedback(`Color ${!c.activo ? 'activado' : 'desactivado'}`)
      setColores(prev => prev.map(col => col.id === c.id ? { ...col, activo: !c.activo } : col))
    } catch { showFeedback('Error al actualizar') }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/colores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: false }),
      })
      if (!res.ok) throw new Error()
      showFeedback('Color desactivado')
      setConfirmDeleteId(null)
      setColores(prev => prev.filter(c => c.id !== id))
    } catch { showFeedback('Error al desactivar') }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/colores/${editingId}` : '/api/admin/colores'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Color actualizado' : 'Color creado')
      closeModal()
      await loadData()
    } catch { showFeedback('Error al guardar') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>Colores</h2>
        <button onClick={openCreate} style={btnGold}>+ Nuevo color</button>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : colores.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sin colores cargados.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Preview', 'Nombre', 'Hex', 'Tela', 'Activo', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colores.map((c, i) => (
                <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <td style={tdStyle}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.hex, border: '1px solid var(--border)' }} />
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{c.nombre}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{c.hex}</td>
                  <td style={tdStyle}>{c.tela?.nombre ?? '—'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleToggle(c)} style={{
                      background: c.activo ? 'var(--green-soft)' : 'var(--surface2)',
                      color: c.activo ? 'var(--green)' : 'var(--text-muted)',
                      border: 'none', borderRadius: 999, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                    }}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(c)} style={btnSmall}>Editar</button>
                      <button onClick={() => setConfirmDeleteId(c.id)} style={{ ...btnSmall, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDeleteId && (
        <Modal title="Confirmar desactivación" onClose={() => setConfirmDeleteId(null)}>
          <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 24 }}>
            ¿Seguro que querés desactivar este color? Va a dejar de aparecer en el configurador.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={() => setConfirmDeleteId(null)} style={btnGhost}>Cancelar</button>
            <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnGold, background: '#ef4444' }}>
              Sí, desactivar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal crear/editar */}
      {modalOpen && (
        <Modal title={editingId ? 'Editar color' : 'Nuevo color'} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Tela">
              <select style={inputStyle} value={form.tela_id} onChange={e => setForm(f => ({ ...f, tela_id: e.target.value }))}>
                <option value="">Seleccionar tela…</option>
                {telas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </Field>
            <Field label="Nombre">
              <input style={inputStyle} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </Field>
            <Field label="Color">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.hex} onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                  style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                <input style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} value={form.hex}
                  onChange={e => setForm(f => ({ ...f, hex: e.target.value }))} placeholder="#000000" />
              </div>
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
              Activo
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnGold}>{saving ? 'Guardando…' : 'Guardar'}</button>
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
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ color: 'var(--text-mid)', fontSize: 13 }}>{label}</label>{children}</div>
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