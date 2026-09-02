'use client'

import { useEffect, useState, useCallback } from 'react'

interface Faq {
  id: string
  categoria: string
  pregunta: string
  respuesta: string
  orden: number
  activo: boolean
}

interface FaqForm {
  categoria: string
  pregunta: string
  respuesta: string
  orden: string
  activo: boolean
}

const CATEGORIAS = ['Quiénes somos','Productos y Materiales','Medidas y Fabricación','Precios y Presupuestos','Instalación','Envíos y Entregas','Cambios, Garantías y Posventa','Asesoramiento']
const EMPTY_FORM: FaqForm = { categoria: CATEGORIAS[0], pregunta: '', respuesta: '', orden: '0', activo: true }
const PAGE_SIZE = 10

export default function FaqAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FaqForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [pagina, setPagina] = useState(1)

  const showFeedback = (msg: string, ok = true) => { setFeedback({ msg, ok }); setTimeout(() => setFeedback(null), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/faq')
      const data = await res.json()
      setFaqs(data.faqs ?? [])
    } catch { setError('Error al cargar preguntas') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  function openEdit(f: Faq) { setEditingId(f.id); setForm({ categoria: f.categoria, pregunta: f.pregunta, respuesta: f.respuesta, orden: String(f.orden), activo: f.activo }); setModalOpen(true) }
  function closeModal() { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleToggle(f: Faq) {
    try {
      await fetch(`/api/admin/faq/${f.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !f.activo }) })
      showFeedback(`Pregunta ${!f.activo ? 'activada' : 'desactivada'}`)
      setFaqs(prev => prev.map(x => x.id === f.id ? { ...x, activo: !f.activo } : x))
    } catch { showFeedback('Error al actualizar', false) }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
      showFeedback('Pregunta eliminada')
      setConfirmDeleteId(null)
      setFaqs(prev => prev.filter(f => f.id !== id))
    } catch { showFeedback('Error al eliminar', false) }
  }

  async function handleSave() {
    if (!form.pregunta.trim() || !form.respuesta.trim()) { showFeedback('La pregunta y respuesta son obligatorias', false); return }
    setSaving(true)
    try {
      const payload = { categoria: form.categoria, pregunta: form.pregunta, respuesta: form.respuesta, orden: Number(form.orden) || 0, activo: form.activo }
      const url = editingId ? `/api/admin/faq/${editingId}` : '/api/admin/faq'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      showFeedback(editingId ? 'Pregunta actualizada' : 'Pregunta creada')
      closeModal(); loadData()
    } catch { showFeedback('Error al guardar', false) }
    finally { setSaving(false) }
  }

  const filtrados = faqs.filter(f => {
    const matchB = f.pregunta.toLowerCase().includes(busqueda.toLowerCase()) || f.respuesta.toLowerCase().includes(busqueda.toLowerCase())
    const matchC = filtroCategoria === 'todas' ? true : f.categoria === filtroCategoria
    return matchB && matchC
  })
  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE)
  const paginados = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>Preguntas frecuentes</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0 0' }}>{faqs.filter(f => f.activo).length} activas · {faqs.filter(f => !f.activo).length} inactivas</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1500CC', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva pregunta
        </button>
      </div>

      {feedback && <div style={{ borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 16, background: feedback.ok ? '#EDFDF4' : '#FEF2F2', color: feedback.ok ? '#16A34A' : '#DC2626', border: `1px solid ${feedback.ok ? '#BBF7D0' : '#FECACA'}` }}>{feedback.msg}</div>}

      <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EAECF0', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }} placeholder="Buscar pregunta..." style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
          </div>
          <select value={filtroCategoria} onChange={e => { setFiltroCategoria(e.target.value); setPagina(1) }} style={{ padding: '9px 36px 9px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Cargando…</div> : error ? <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', fontSize: 14 }}>{error}</div> : faqs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: 15, marginBottom: 16 }}>Todavía no hay preguntas cargadas.</p>
            <button onClick={openCreate} style={btnPrimary}>+ Agregar la primera</button>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Categoría', 'Pregunta', 'Respuesta', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600, borderBottom: '1px solid #EAECF0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: i < paginados.length - 1 ? '1px solid #F5F5F5' : 'none', opacity: f.activo ? 1 : 0.55 }}>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: '#EEF0FF', color: '#1500CC', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{f.categoria}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0D0D0D', maxWidth: 260 }}>{f.pregunta}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#666', maxWidth: 300 }}>
                      {f.respuesta ? (f.respuesta.length > 80 ? f.respuesta.slice(0, 80) + '…' : f.respuesta) : <span style={{ color: '#CCC', fontStyle: 'italic' }}>Sin respuesta</span>}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleToggle(f)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: f.activo ? '#EDFDF4' : '#F5F5F5', color: f.activo ? '#16A34A' : '#999', border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.activo ? '#16A34A' : '#999', display: 'inline-block' }} />
                        {f.activo ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(f)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #EAECF0', background: '#fff', color: '#1500CC', cursor: 'pointer' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                        <button onClick={() => setConfirmDeleteId(f.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>
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
              <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Mostrando {filtrados.length === 0 ? 0 : (pagina - 1) * PAGE_SIZE + 1} a {Math.min(pagina * PAGE_SIZE, filtrados.length)} de {filtrados.length} preguntas</p>
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

      {confirmDeleteId && (() => {
        const f = faqs.find(x => x.id === confirmDeleteId)
        return (
          <Modal title="Eliminar pregunta" onClose={() => setConfirmDeleteId(null)}>
            <p style={{ color: '#555', fontSize: 14, marginBottom: 4 }}>¿Seguro que querés eliminar esta pregunta?</p>
            <p style={{ color: '#999', fontSize: 13, fontStyle: 'italic', marginBottom: 24 }}>"{f?.pregunta}"</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setConfirmDeleteId(null)} style={btnGhost}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnPrimary, background: '#DC2626' }}>Eliminar</button>
            </div>
          </Modal>
        )
      })()}

      {modalOpen && (
        <Modal title={editingId ? 'Editar pregunta' : 'Nueva pregunta'} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Categoría">
              <select style={inputStyle} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Pregunta">
              <input style={inputStyle} value={form.pregunta} onChange={e => setForm(f => ({ ...f, pregunta: e.target.value }))} placeholder="¿Cuánto tarda la fabricación?" />
            </Field>
            <Field label="Respuesta">
              <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.respuesta} onChange={e => setForm(f => ({ ...f, respuesta: e.target.value }))} placeholder="Escribí la respuesta completa aquí..." />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
              Visible en el sitio
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={closeModal} style={btnGhost}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear pregunta'}</button>
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
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
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
const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #EAECF0', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#FAFAFA', fontFamily: 'inherit' }
const btnPrimary: React.CSSProperties = { background: '#1500CC', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const btnGhost: React.CSSProperties = { background: '#fff', color: '#555', border: '1px solid #EAECF0', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }