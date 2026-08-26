'use client'

import { useEffect, useState, useCallback } from 'react'

interface Tela { id: string; nombre: string }
interface Color { id: string; tela_id: string; nombre: string; hex: string }
interface ProductoStock {
  id: string
  tela_id: string
  color_id: string
  nombre: string
  ancho_cm: number
  alto_cm: number
  precio: number
  activo: boolean
  stock_cantidad: number
  tela?: { nombre: string }
  color?: { nombre: string; hex: string }
}

interface StockForm {
  nombre: string
  tela_id: string
  color_id: string
  ancho_cm: string
  alto_cm: string
  precio: string
  stock_cantidad: string
  activo: boolean
}

const EMPTY_FORM: StockForm = {
  nombre: '', tela_id: '', color_id: '', ancho_cm: '', alto_cm: '', precio: '', stock_cantidad: '', activo: true,
}

const ar = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function StockPage() {
  const [productos, setProductos] = useState<ProductoStock[]>([])
  const [telas, setTelas] = useState<Tela[]>([])
  const [colores, setColores] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [stockModalId, setStockModalId] = useState<string | null>(null)
  const [stockInput, setStockInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StockForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const showFeedback = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(null), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [sRes, tRes, cRes] = await Promise.all([
        fetch('/api/admin/stock'),
        fetch('/api/admin/telas'),
        fetch('/api/admin/colores'),
      ])
      const sData = await sRes.json()
      const tData = await tRes.json()
      const cData = await cRes.json()
      setProductos(sData.productos ?? [])
      setTelas(tData.telas ?? [])
      setColores(cData.colores ?? [])
    } catch { setError('Error al cargar stock') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filteredColors = colores.filter(c => c.tela_id === form.tela_id)

  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  function openEdit(p: ProductoStock) {
    setEditingId(p.id)
    setForm({
      nombre: p.nombre, tela_id: p.tela_id, color_id: p.color_id,
      ancho_cm: String(p.ancho_cm), alto_cm: String(p.alto_cm),
      precio: String(p.precio), stock_cantidad: String(p.stock_cantidad), activo: p.activo,
    })
    setModalOpen(true)
  }
  function openStockEdit(p: ProductoStock) { setStockModalId(p.id); setStockInput(String(p.stock_cantidad)) }
  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleToggle(p: ProductoStock) {
    try {
      const res = await fetch(`/api/admin/stock/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !p.activo }),
      })
      if (!res.ok) throw new Error()
      showFeedback(`Producto ${!p.activo ? 'activado' : 'desactivado'}`)
      loadData()
    } catch { showFeedback('Error al actualizar') }
  }

  async function handleStockSave() {
    if (!stockModalId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/stock/${stockModalId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_cantidad: Number(stockInput) }),
      })
      if (!res.ok) throw new Error()
      showFeedback('Stock actualizado')
      setStockModalId(null)
      loadData()
    } catch { showFeedback('Error al actualizar stock') }
    finally { setSaving(false) }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        ancho_cm: Number(form.ancho_cm),
        alto_cm: Number(form.alto_cm),
        precio: Number(form.precio),
        stock_cantidad: Number(form.stock_cantidad),
      }
      const url = editingId ? `/api/admin/stock/${editingId}` : '/api/admin/stock'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Producto actualizado' : 'Producto creado')
      closeModal()
      loadData()
    } catch { showFeedback('Error al guardar') }
    finally { setSaving(false) }
  }

  function setF(key: keyof StockForm, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>Stock</h2>
        <button onClick={openCreate} style={btnGold}>+ Nuevo producto</button>
      </div>

      {feedback && <div style={feedbackStyle}>{feedback}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : productos.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sin productos en stock.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Nombre', 'Tela', 'Color', 'Medidas', 'Precio', 'Stock', 'Activo', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{p.nombre}</td>
                  <td style={tdStyle}>{p.tela?.nombre ?? '—'}</td>
                  <td style={tdStyle}>
                    <div className="flex items-center gap-2">
                      {p.color?.hex && (
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.color.hex, border: '1px solid var(--border)', flexShrink: 0 }} />
                      )}
                      {p.color?.nombre ?? '—'}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.ancho_cm} × {p.alto_cm} cm</td>
                  <td style={{ ...tdStyle, color: 'var(--gold)' }}>{ar(p.precio)}</td>
                  <td style={tdStyle}>
                    <span style={{ color: p.stock_cantidad > 0 ? 'var(--green)' : '#ef4444', fontWeight: 600 }}>
                      {p.stock_cantidad}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleToggle(p)} style={{
                      background: p.activo ? 'var(--green-soft)' : 'var(--surface2)',
                      color: p.activo ? 'var(--green)' : 'var(--text-muted)',
                      border: 'none', borderRadius: 999, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                    }}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div className="flex gap-2">
                      <button onClick={() => openStockEdit(p)} style={btnSmall}>Stock</button>
                      <button onClick={() => openEdit(p)} style={btnSmall}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick stock modal */}
      {stockModalId && (
        <Modal title="Actualizar stock" onClose={() => setStockModalId(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Cantidad en stock">
              <input type="number" style={inputStyle} value={stockInput} onChange={e => setStockInput(e.target.value)} />
            </Field>
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={() => setStockModalId(null)} style={btnGhost}>Cancelar</button>
              <button onClick={handleStockSave} disabled={saving} style={btnGold}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Full edit modal */}
      {modalOpen && (
        <Modal title={editingId ? 'Editar producto' : 'Nuevo producto'} onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <Field label="Nombre"><input style={inputStyle} value={form.nombre} onChange={e => setF('nombre', e.target.value)} /></Field>
            <Field label="Tela">
              <select style={inputStyle} value={form.tela_id} onChange={e => { setF('tela_id', e.target.value); setF('color_id', '') }}>
                <option value="">Seleccionar…</option>
                {telas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </Field>
            <Field label="Color">
              <select style={inputStyle} value={form.color_id} onChange={e => setF('color_id', e.target.value)} disabled={!form.tela_id}>
                <option value="">Seleccionar…</option>
                {filteredColors.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ancho (cm)"><input type="number" style={inputStyle} value={form.ancho_cm} onChange={e => setF('ancho_cm', e.target.value)} /></Field>
              <Field label="Alto (cm)"><input type="number" style={inputStyle} value={form.alto_cm} onChange={e => setF('alto_cm', e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio ($)"><input type="number" style={inputStyle} value={form.precio} onChange={e => setF('precio', e.target.value)} /></Field>
              <Field label="Stock"><input type="number" style={inputStyle} value={form.stock_cantidad} onChange={e => setF('stock_cantidad', e.target.value)} /></Field>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setF('activo', e.target.checked)} />
              Activo
            </label>
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
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '100%', maxWidth: 520, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
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