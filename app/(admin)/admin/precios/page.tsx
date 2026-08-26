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

interface Tela { id: string; nombre: string }

interface PrecioForm {
  tela_id: string
  precio_m2: string
  motorizada_extra: string
  instalacion_extra: string
  minimo_ancho: string
  maximo_ancho: string
  minimo_alto: string
  maximo_alto: string
}

const EMPTY_FORM: PrecioForm = {
  tela_id: '', precio_m2: '', motorizada_extra: '', instalacion_extra: '',
  minimo_ancho: '', maximo_ancho: '', minimo_alto: '', maximo_alto: '',
}

const ar = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function PreciosPage() {
  const [reglas, setReglas] = useState<ReglaPrecio[]>([])
  const [telas, setTelas] = useState<Tela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PrecioForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const showFeedback = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(null), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [pRes, tRes] = await Promise.all([fetch('/api/admin/precios'), fetch('/api/admin/telas')])
      const pData = await pRes.json()
      const tData = await tRes.json()
      setReglas(pData.reglas ?? [])
      setTelas(tData.telas ?? [])
    } catch { setError('Error al cargar precios') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(r: ReglaPrecio) {
    setEditingId(r.id)
    setForm({
      tela_id: r.tela_id,
      precio_m2: String(r.precio_m2),
      motorizada_extra: String(r.motorizada_extra),
      instalacion_extra: String(r.instalacion_extra),
      minimo_ancho: String(r.minimo_ancho),
      maximo_ancho: String(r.maximo_ancho),
      minimo_alto: String(r.minimo_alto),
      maximo_alto: String(r.maximo_alto),
    })
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        tela_id: form.tela_id,
        precio_m2: Number(form.precio_m2),
        motorizada_extra: Number(form.motorizada_extra),
        instalacion_extra: Number(form.instalacion_extra),
        minimo_ancho: Number(form.minimo_ancho),
        maximo_ancho: Number(form.maximo_ancho),
        minimo_alto: Number(form.minimo_alto),
        maximo_alto: Number(form.maximo_alto),
      }
      const url = editingId ? `/api/admin/precios/${editingId}` : '/api/admin/precios'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Regla actualizada' : 'Regla creada')
      closeModal()
      loadData()
    } catch { showFeedback('Error al guardar') }
    finally { setSaving(false) }
  }

  function setF(key: keyof PrecioForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>Precios</h2>
        <button onClick={openCreate} style={btnGold}>+ Nueva regla</button>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : reglas.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sin reglas de precio.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Tela', 'Precio/m²', 'Motorizada extra', 'Instalación extra', 'Medidas mín/máx', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reglas.map((r, i) => (
                <tr key={r.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{r.tela?.nombre ?? '—'}</td>
                  <td style={{ ...tdStyle, color: 'var(--gold)' }}>{ar(r.precio_m2)}</td>
                  <td style={tdStyle}>{ar(r.motorizada_extra)}</td>
                  <td style={tdStyle}>{ar(r.instalacion_extra)}</td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    {r.minimo_ancho}–{r.maximo_ancho} × {r.minimo_alto}–{r.maximo_alto} cm
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => openEdit(r)} style={btnSmall}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? 'Editar regla' : 'Nueva regla'} onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <Field label="Tela">
              <select style={inputStyle} value={form.tela_id} onChange={e => setF('tela_id', e.target.value)}>
                <option value="">Seleccionar…</option>
                {telas
                  .filter(t => editingId ? true : !reglas.some(r => r.tela_id === t.id))
                  .map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)
                }
              </select>
            </Field>
            {[
              { key: 'precio_m2', label: 'Precio por m²' },
              { key: 'motorizada_extra', label: 'Extra motorizada ($)' },
              { key: 'instalacion_extra', label: 'Extra instalación ($)' },
              { key: 'minimo_ancho', label: 'Mínimo ancho (cm)' },
              { key: 'maximo_ancho', label: 'Máximo ancho (cm)' },
              { key: 'minimo_alto', label: 'Mínimo alto (cm)' },
              { key: 'maximo_alto', label: 'Máximo alto (cm)' },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <input
                  type="number"
                  style={inputStyle}
                  value={form[key as keyof PrecioForm]}
                  onChange={e => setF(key as keyof PrecioForm, e.target.value)}
                />
              </Field>
            ))}
            <div className="flex justify-end gap-3 mt-2">
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
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '100%', maxWidth: 480, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
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
  return <div className="flex flex-col gap-1"><label style={{ color: 'var(--text-mid)', fontSize: 13 }}>{label}</label>{children}</div>
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