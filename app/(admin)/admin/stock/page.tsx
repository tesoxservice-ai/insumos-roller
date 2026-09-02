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
  nombre: '', tela_id: '', color_id: '', ancho_cm: '', alto_cm: '', precio: '', stock_cantidad: '1', activo: true,
}

const ar = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function StockPage() {
  const [productos, setProductos] = useState<ProductoStock[]>([])
  const [telas, setTelas] = useState<Tela[]>([])
  const [colores, setColores] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StockForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const showFeedback = (msg: string, ok = true) => {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [sRes, tRes, cRes] = await Promise.all([
        fetch('/api/admin/stock'),
        fetch('/api/admin/telas'),
        fetch('/api/admin/colores'),
      ])
      const [sData, tData, cData] = await Promise.all([sRes.json(), tRes.json(), cRes.json()])
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
  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }
  function setF(key: keyof StockForm, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleToggle(p: ProductoStock) {
    try {
      const res = await fetch(`/api/admin/stock/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !p.activo }),
      })
      if (!res.ok) throw new Error()
      showFeedback(`Producto ${!p.activo ? 'publicado' : 'ocultado'}`)
      setProductos(prev => prev.map(x => x.id === p.id ? { ...x, activo: !p.activo } : x))
    } catch { showFeedback('Error al actualizar', false) }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/stock/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      showFeedback('Producto eliminado')
      setConfirmDeleteId(null)
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch { showFeedback('Error al eliminar', false) }
  }

  async function handleSave() {
    if (!form.nombre || !form.tela_id || !form.precio) {
      showFeedback('Completá nombre, tela y precio', false)
      return
    }
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        tela_id: form.tela_id,
        color_id: form.color_id || null,
        ancho_cm: Number(form.ancho_cm) || 0,
        alto_cm: Number(form.alto_cm) || 0,
        precio: Number(form.precio),
        stock_cantidad: Number(form.stock_cantidad) || 0,
        activo: form.activo,
      }
      const url = editingId ? `/api/admin/stock/${editingId}` : '/api/admin/stock'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Producto actualizado' : 'Producto creado')
      closeModal()
      loadData()
    } catch { showFeedback('Error al guardar', false) }
    finally { setSaving(false) }
  }

  const activos = productos.filter(p => p.activo)
  const inactivos = productos.filter(p => !p.activo)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, margin: 0 }}>Stock</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0 0' }}>
            {activos.length} publicado{activos.length !== 1 ? 's' : ''} · {inactivos.length} oculto{inactivos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} style={btnGold}>+ Nuevo producto</button>
      </div>

      {feedback && (
        <div style={{
          ...feedbackStyle,
          background: feedback.ok ? 'var(--green-soft)' : 'rgba(239,68,68,0.1)',
          color: feedback.ok ? 'var(--green)' : '#ef4444',
          border: `1px solid ${feedback.ok ? 'rgba(74,155,111,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 15, marginBottom: 12 }}>Sin productos en stock todavía.</p>
          <button onClick={openCreate} style={btnGold}>+ Agregar el primero</button>
        </div>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Nombre', 'Tela · Color', 'Medidas', 'Precio', 'Stock', 'Visible', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} style={{
                  borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                  opacity: p.activo ? 1 : 0.5,
                }}>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 600 }}>{p.nombre}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {p.color?.hex && (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.color.hex, border: '1px solid var(--border)', flexShrink: 0 }} />
                      )}
                      <span>{p.tela?.nombre ?? '—'}{p.color?.nombre ? ` · ${p.color.nombre}` : ''}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {p.ancho_cm && p.alto_cm ? `${p.ancho_cm} × ${p.alto_cm} cm` : '—'}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: 600 }}>{ar(p.precio)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      fontWeight: 700, fontSize: 15,
                      color: p.stock_cantidad === 0 ? '#ef4444' : p.stock_cantidad <= 2 ? '#f59e0b' : 'var(--green)',
                    }}>
                      {p.stock_cantidad}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleToggle(p)} style={{
                      background: p.activo ? 'var(--green-soft)' : 'var(--surface2)',
                      color: p.activo ? 'var(--green)' : 'var(--text-muted)',
                      border: 'none', borderRadius: 999, padding: '4px 12px',
                      fontSize: 12, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap',
                    }}>
                      {p.activo ? '👁 Visible' : '🙈 Oculto'}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={btnSmall}>Editar</button>
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        style={{ ...btnSmall, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                      >
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
      {confirmDeleteId && (() => {
        const p = productos.find(x => x.id === confirmDeleteId)
        return (
          <Modal title="Eliminar producto" onClose={() => setConfirmDeleteId(null)}>
            <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 8 }}>
              ¿Seguro que querés eliminar <strong style={{ color: 'var(--text)' }}>{p?.nombre}</strong>?
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
              Esta acción no se puede deshacer. Si querés sacarlo temporalmente de la tienda usá "Oculto".
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setConfirmDeleteId(null)} style={btnGhost}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnGold, background: '#ef4444' }}>
                Sí, eliminar
              </button>
            </div>
          </Modal>
        )
      })()}

      {/* Modal crear / editar */}
      {modalOpen && (
        <Modal title={editingId ? 'Editar producto' : 'Nuevo producto'} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <Field label="Nombre del producto">
              <input style={inputStyle} value={form.nombre}
                onChange={e => setF('nombre', e.target.value)}
                placeholder="Ej: Roller Blackout Blanco 120×160" />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Tela">
                <select style={inputStyle} value={form.tela_id}
                  onChange={e => { setF('tela_id', e.target.value); setF('color_id', '') }}>
                  <option value="">Seleccionar…</option>
                  {telas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </Field>
              <Field label="Color">
                <select style={inputStyle} value={form.color_id}
                  onChange={e => setF('color_id', e.target.value)}
                  disabled={!form.tela_id}>
                  <option value="">Sin color</option>
                  {filteredColors.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', margin: '0 0 12px 0' }}>MEDIDAS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Ancho (cm)">
                  <input type="number" style={inputStyle} value={form.ancho_cm}
                    onChange={e => setF('ancho_cm', e.target.value)} placeholder="120" />
                </Field>
                <Field label="Alto (cm)">
                  <input type="number" style={inputStyle} value={form.alto_cm}
                    onChange={e => setF('alto_cm', e.target.value)} placeholder="160" />
                </Field>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', margin: '0 0 12px 0' }}>PRECIO Y STOCK</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Precio ($)">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                    <input type="number" style={{ ...inputStyle, paddingLeft: 24 }} value={form.precio}
                      onChange={e => setF('precio', e.target.value)} placeholder="0" />
                  </div>
                </Field>
                <Field label="Cantidad en stock">
                  <input type="number" style={inputStyle} value={form.stock_cantidad}
                    onChange={e => setF('stock_cantidad', e.target.value)} placeholder="1" min="0" />
                </Field>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setF('activo', e.target.checked)} />
              Visible en la tienda al guardar
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnGold}>
                {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear producto'}
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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ color: 'var(--text-mid)', fontSize: 13 }}>{label}</label>
      {children}
    </div>
  )
}

const tableWrapper: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', overflowX: 'auto' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--text-mid)' }
const inputStyle: React.CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', padding: '9px 12px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }
const btnGold: React.CSSProperties = { background: 'var(--gold)', color: '#0F0E0C', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, cursor: 'pointer' }
const btnSmall: React.CSSProperties = { background: 'var(--surface2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: 12, cursor: 'pointer' }
const feedbackStyle: React.CSSProperties = { borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }