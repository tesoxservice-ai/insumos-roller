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
const PAGE_SIZE = 15

export default function ColoresPage() {
  const [colores, setColores] = useState<Color[]>([])
  const [telas, setTelas] = useState<Tela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ColorForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [pagina, setPagina] = useState(1)

  const showFeedback = (msg: string, ok = true) => {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [cRes, tRes] = await Promise.all([fetch('/api/admin/colores'), fetch('/api/admin/telas')])
      const cData = await cRes.json()
      const tData = await tRes.json()
      setColores(cData.colores ?? [])
      setTelas(tData.telas ?? [])
    } catch { setError('Error al cargar colores') }
    finally { setLoading(false) }
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
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !c.activo }),
      })
      if (!res.ok) throw new Error()
      showFeedback(`Color ${!c.activo ? 'activado' : 'desactivado'}`)
      setColores(prev => prev.map(col => col.id === c.id ? { ...col, activo: !c.activo } : col))
    } catch { showFeedback('Error al actualizar', false) }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/colores/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      showFeedback('Color eliminado')
      setConfirmDeleteId(null)
      setColores(prev => prev.filter(c => c.id !== id))
    } catch { showFeedback('Error al eliminar', false) }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/colores/${editingId}` : '/api/admin/colores'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Color actualizado' : 'Color creado')
      closeModal(); await loadData()
    } catch { showFeedback('Error al guardar', false) }
    finally { setSaving(false) }
  }

  // Filtros
  const filtrados = colores.filter(c => {
    const matchBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.tela?.nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === 'todos' ? true : filtroEstado === 'activo' ? c.activo : !c.activo
    return matchBusqueda && matchEstado
  })

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE)
  const paginados = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>Colores</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0 0' }}>Gestioná todos los colores de tus telas.</p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#1500CC', color: '#fff', border: 'none',
          borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo color
        </button>
      </div>

      {feedback && (
        <div style={{
          borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 16,
          background: feedback.ok ? '#EDFDF4' : '#FEF2F2',
          color: feedback.ok ? '#16A34A' : '#DC2626',
          border: `1px solid ${feedback.ok ? '#BBF7D0' : '#FECACA'}`,
        }}>{feedback.msg}</div>
      )}

      {/* Tabla */}
      <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, overflow: 'hidden' }}>

        {/* Buscador y filtro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EAECF0' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={busqueda}
              onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
              placeholder="Buscar color..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={filtroEstado}
            onChange={e => { setFiltroEstado(e.target.value as any); setPagina(1) }}
            style={{ padding: '9px 36px 9px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="todos">Estado: Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Cargando…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', fontSize: 14 }}>{error}</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Preview', 'Nombre', 'Hex', 'Tela', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600, borderBottom: '1px solid #EAECF0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < paginados.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.hex, border: '2px solid #EAECF0' }} />
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#0D0D0D' }}>{c.nombre}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#666', fontFamily: 'monospace' }}>{c.hex}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#666' }}>{c.tela?.nombre ?? '—'}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleToggle(c)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: c.activo ? '#EDFDF4' : '#F5F5F5',
                        color: c.activo ? '#16A34A' : '#999',
                        border: 'none', borderRadius: 20, padding: '4px 12px',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.activo ? '#16A34A' : '#999', display: 'inline-block' }} />
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(c)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                          border: '1px solid #EAECF0', background: '#fff', color: '#1500CC', cursor: 'pointer',
                        }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                        <button onClick={() => setConfirmDeleteId(c.id)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                          border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer',
                        }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #EAECF0' }}>
              <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
                Mostrando {filtrados.length === 0 ? 0 : (pagina - 1) * PAGE_SIZE + 1} a {Math.min(pagina * PAGE_SIZE, filtrados.length)} de {filtrados.length} colores
              </p>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={paginBtn(false)}>‹</button>
                {Array.from({ length: Math.min(totalPaginas, 6) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPagina(p)} style={paginBtn(p === pagina)}>{p}</button>
                ))}
                {totalPaginas > 6 && <span style={{ padding: '6px 8px', fontSize: 13, color: '#999' }}>…</span>}
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas || totalPaginas === 0} style={paginBtn(false)}>›</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal eliminar */}
      {confirmDeleteId && (
        <Modal title="Eliminar color" onClose={() => setConfirmDeleteId(null)}>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>¿Seguro que querés eliminar este color?</p>
          <p style={{ color: '#999', fontSize: 13, marginBottom: 24 }}>Si querés ocultarlo temporalmente usá el toggle de estado.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setConfirmDeleteId(null)} style={btnGhost}>Cancelar</button>
            <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnPrimary, background: '#DC2626' }}>Eliminar</button>
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
              <input style={inputStyle} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Blanco" />
            </Field>
            <Field label="Color">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={form.hex} onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                  style={{ width: 44, height: 40, border: '1px solid #EAECF0', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                <input style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} value={form.hex}
                  onChange={e => setForm(f => ({ ...f, hex: e.target.value }))} placeholder="#000000" />
              </div>
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
              Activo
            </label>
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

function paginBtn(active: boolean): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${active ? '#1500CC' : '#EAECF0'}`,
    background: active ? '#1500CC' : '#fff', color: active ? '#fff' : '#555',
    fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  }
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
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#FAFAFA' }
const btnPrimary: React.CSSProperties = { background: '#1500CC', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: '#fff', color: '#555', border: '1px solid #EAECF0', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }