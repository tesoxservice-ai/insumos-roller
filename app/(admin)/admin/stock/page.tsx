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
  imagen_url?: string | null
  tela?: { nombre: string }
  color?: { nombre: string; hex: string }
}

interface StockForm {
  nombre: string
  tipo: string
  tela_id: string
  color_id: string
  ancho_cm: string
  alto_cm: string
  precio: string
  stock_cantidad: string
  activo: boolean
  imagen_url: string
}

const EMPTY_FORM: StockForm = { nombre: '', tipo: '', tela_id: '', color_id: '', ancho_cm: '', alto_cm: '', precio: '', stock_cantidad: '1', activo: true, imagen_url: '' }
const TIPOS_CORTINA = ['Roller', 'Verticales', 'Romana']
const PAGE_SIZE = 10

const IMAGENES_DISPONIBLES: Record<string, Record<string, string>> = {
  'Roller': { 'blanco': '/images/stock/roller-blanco.png', 'gris': '/images/stock/roller-gris.png', 'gris marengo': '/images/stock/roller-gris-marengo.png', 'negro': '/images/stock/roller-negro.png', 'beige': '/images/stock/roller-beige.png' },
  'Verticales': { 'blanco': '/images/stock/vertical-blanco.png', 'gris': '/images/stock/vertical-gris.png', 'gris marengo': '/images/stock/vertical-gris-marengo.png', 'negro': '/images/stock/vertical-negro.png', 'beige': '/images/stock/vertical-beige.png' },
  'Romana': { 'blanco': '/images/stock/romana-blanco.jpg', 'gris': '/images/stock/romana-gris.jpg', 'natural': '/images/stock/romana-natural.jpg', 'negro': '/images/stock/romana-negro.jpg' },
}

function getImagenUrl(tipo: string, colorNombre: string): string {
  if (!tipo || !colorNombre || tipo === 'Textiles') return ''
  return IMAGENES_DISPONIBLES[tipo]?.[colorNombre.toLowerCase()] ?? ''
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
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [pagina, setPagina] = useState(1)

  const showFeedback = (msg: string, ok = true) => { setFeedback({ msg, ok }); setTimeout(() => setFeedback(null), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [sRes, tRes, cRes] = await Promise.all([fetch('/api/admin/stock'), fetch('/api/admin/telas'), fetch('/api/admin/colores')])
      const [sData, tData, cData] = await Promise.all([sRes.json(), tRes.json(), cRes.json()])
      setProductos(sData.productos ?? [])
      setTelas(tData.telas ?? [])
      setColores(cData.colores ?? [])
    } catch { setError('Error al cargar stock') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filteredColors = colores.filter(c => 
    c.tela_id === form.tela_id &&
    !['beige', 'gris marengo', 'natural'].includes(c.nombre.toLowerCase())
  )

  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  function openEdit(p: ProductoStock) {
    setEditingId(p.id)
    setForm({ nombre: p.nombre, tipo: '', tela_id: p.tela_id, color_id: p.color_id, ancho_cm: String(p.ancho_cm), alto_cm: String(p.alto_cm), precio: String(p.precio), stock_cantidad: String(p.stock_cantidad), activo: p.activo, imagen_url: p.imagen_url ?? '' })
    setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }
  function setF(key: keyof StockForm, value: string | boolean) { setForm(f => ({ ...f, [key]: value })) }

  async function handleToggle(p: ProductoStock) {
    try {
      await fetch(`/api/admin/stock/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !p.activo }) })
      showFeedback(`Producto ${!p.activo ? 'publicado' : 'ocultado'}`)
      setProductos(prev => prev.map(x => x.id === p.id ? { ...x, activo: !p.activo } : x))
    } catch { showFeedback('Error al actualizar', false) }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/admin/stock/${id}`, { method: 'DELETE' })
      showFeedback('Producto eliminado')
      setConfirmDeleteId(null)
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch { showFeedback('Error al eliminar', false) }
  }

  async function handleSave() {
    if (!form.nombre || !form.tela_id || !form.precio) { showFeedback('Completá nombre, tela y precio', false); return }
    setSaving(true)
    try {
      const payload = { nombre: form.nombre, tela_id: form.tela_id, color_id: form.color_id || null, ancho_cm: Number(form.ancho_cm) || 0, alto_cm: Number(form.alto_cm) || 0, precio: Number(form.precio), stock_cantidad: Number(form.stock_cantidad) || 0, activo: form.activo, imagen_url: form.imagen_url || null }
      const url = editingId ? `/api/admin/stock/${editingId}` : '/api/admin/stock'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Producto actualizado' : 'Producto creado')
      closeModal(); loadData()
    } catch { showFeedback('Error al guardar', false) }
    finally { setSaving(false) }
  }

  const filtrados = productos.filter(p => {
    const matchB = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchE = filtroEstado === 'todos' ? true : filtroEstado === 'activo' ? p.activo : !p.activo
    return matchB && matchE
  })
  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE)
  const paginados = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>Stock</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0 0' }}>{productos.filter(p => p.activo).length} publicados · {productos.filter(p => !p.activo).length} ocultos</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1500CC', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo producto
        </button>
      </div>

      {feedback && <div style={{ borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 16, background: feedback.ok ? '#EDFDF4' : '#FEF2F2', color: feedback.ok ? '#16A34A' : '#DC2626', border: `1px solid ${feedback.ok ? '#BBF7D0' : '#FECACA'}` }}>{feedback.msg}</div>}

      <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EAECF0' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }} placeholder="Buscar producto..." style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
          </div>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value as any); setPagina(1) }} style={{ padding: '9px 36px 9px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
            <option value="todos">Estado: Todos</option>
            <option value="activo">Publicados</option>
            <option value="inactivo">Ocultos</option>
          </select>
        </div>

        {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Cargando…</div> : error ? <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', fontSize: 14 }}>{error}</div> : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Nombre', 'Tela · Color', 'Medidas', 'Precio', 'Stock', 'Visible', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600, borderBottom: '1px solid #EAECF0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < paginados.length - 1 ? '1px solid #F5F5F5' : 'none', opacity: p.activo ? 1 : 0.55 }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{p.nombre}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#666' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.color?.hex && <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.color.hex, border: '1px solid #EAECF0' }} />}
                        {p.tela?.nombre ?? '—'}{p.color?.nombre ? ` · ${p.color.nombre}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>{p.ancho_cm && p.alto_cm ? `${p.ancho_cm} × ${p.alto_cm} cm` : '—'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#1500CC' }}>{ar(p.precio)}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: p.stock_cantidad === 0 ? '#DC2626' : p.stock_cantidad <= 2 ? '#D97706' : '#16A34A' }}>{p.stock_cantidad}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleToggle(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: p.activo ? '#EDFDF4' : '#F5F5F5', color: p.activo ? '#16A34A' : '#999', border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.activo ? '#16A34A' : '#999', display: 'inline-block' }} />
                        {p.activo ? 'Visible' : 'Oculto'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #EAECF0', background: '#fff', color: '#1500CC', cursor: 'pointer' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                        <button onClick={() => setConfirmDeleteId(p.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #EAECF0' }}>
              <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Mostrando {filtrados.length === 0 ? 0 : (pagina - 1) * PAGE_SIZE + 1} a {Math.min(pagina * PAGE_SIZE, filtrados.length)} de {filtrados.length} productos</p>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={paginBtn(false)}>‹</button>
                {Array.from({ length: Math.min(totalPaginas, 6) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPagina(p)} style={paginBtn(p === pagina)}>{p}</button>
                ))}
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas || totalPaginas === 0} style={paginBtn(false)}>›</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal eliminar */}
      {confirmDeleteId && (() => {
        const p = productos.find(x => x.id === confirmDeleteId)
        return (
          <Modal title="Eliminar producto" onClose={() => setConfirmDeleteId(null)}>
            <p style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>¿Seguro que querés eliminar <strong>{p?.nombre}</strong>?</p>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 24 }}>Para ocultarlo temporalmente usá el toggle Visible/Oculto.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setConfirmDeleteId(null)} style={btnGhost}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnPrimary, background: '#DC2626' }}>Eliminar</button>
            </div>
          </Modal>
        )
      })()}

      {/* Modal crear/editar */}
      {modalOpen && (
        <Modal title={editingId ? 'Editar producto' : 'Nuevo producto'} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Nombre del producto">
              <input style={inputStyle} value={form.nombre} onChange={e => setF('nombre', e.target.value)} placeholder="Ej: Roller Blackout Blanco 120×160" />
            </Field>
            <Field label="Tipo de cortina">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {TIPOS_CORTINA.map(tipo => (
                  <button key={tipo} type="button" onClick={() => {
                    const color = colores.find(c => c.id === form.color_id)
                    const img = color ? getImagenUrl(tipo, color.nombre) : ''
                    setForm(f => ({ ...f, tipo, imagen_url: img }))
                  }} style={{ padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${form.tipo === tipo ? '#1500CC' : '#EAECF0'}`, background: form.tipo === tipo ? '#EEF0FF' : '#FAFAFA', color: form.tipo === tipo ? '#1500CC' : '#555', fontWeight: form.tipo === tipo ? 700 : 400, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                    {tipo}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Tela">
                <select style={inputStyle} value={form.tela_id} onChange={e => {
                  const colorActual = colores.find(c => c.id === form.color_id)
                  const colorEq = colorActual ? colores.find(c => c.tela_id === e.target.value && c.nombre.toLowerCase() === colorActual.nombre.toLowerCase()) : null
                  const img = colorEq && form.tipo ? getImagenUrl(form.tipo, colorEq.nombre) : ''
                  setForm(f => ({ ...f, tela_id: e.target.value, color_id: colorEq?.id ?? '', imagen_url: img }))
                }}>
                  <option value="">Seleccionar…</option>
                  {telas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </Field>
              <Field label="Color">
                <select style={inputStyle} value={form.color_id} onChange={e => {
                  const color = colores.find(c => c.id === e.target.value)
                  const img = color && form.tipo ? getImagenUrl(form.tipo, color.nombre) : ''
                  setForm(f => ({ ...f, color_id: e.target.value, imagen_url: img }))
                }} disabled={!form.tela_id}>
                  <option value="">Sin color</option>
                  {filteredColors.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </Field>
            </div>
            {form.imagen_url ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#EDFDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                <img src={form.imagen_url} alt="preview" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', margin: 0 }}>✓ Imagen asignada automáticamente</p>
              </div>
            ) : form.tipo && form.color_id && form.tipo !== 'Textiles' ? (
              <div style={{ padding: '10px 14px', background: '#FFF8E8', borderRadius: 8, border: '1px solid #FDE68A' }}>
                <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>⚠ No hay imagen para esta combinación.</p>
              </div>
            ) : null}
            <div style={{ borderTop: '1px solid #EAECF0', paddingTop: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.1em', margin: '0 0 12px 0' }}>MEDIDAS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Ancho (cm)"><input type="number" style={inputStyle} value={form.ancho_cm} onChange={e => setF('ancho_cm', e.target.value)} placeholder="120" /></Field>
                <Field label="Alto (cm)"><input type="number" style={inputStyle} value={form.alto_cm} onChange={e => setF('alto_cm', e.target.value)} placeholder="160" /></Field>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #EAECF0', paddingTop: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.1em', margin: '0 0 12px 0' }}>PRECIO Y STOCK</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Precio ($)">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>$</span>
                    <input type="number" style={{ ...inputStyle, paddingLeft: 24 }} value={form.precio} onChange={e => setF('precio', e.target.value)} />
                  </div>
                </Field>
                <Field label="Cantidad en stock"><input type="number" style={inputStyle} value={form.stock_cantidad} onChange={e => setF('stock_cantidad', e.target.value)} min="0" /></Field>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setF('activo', e.target.checked)} />
              Visible en la tienda
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear producto'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function paginBtn(active: boolean): React.CSSProperties {
  return { width: 32, height: 32, borderRadius: 8, border: `1px solid ${active ? '#1500CC' : '#EAECF0'}`, background: active ? '#1500CC' : '#fff', color: active ? '#fff' : '#555', fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [onClose])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 540, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
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