'use client'

import { useEffect, useState, useCallback } from 'react'
import { useConfigurador } from '@/hooks/useConfigurador'
import { usePresupuesto } from '@/hooks/usePresupuesto'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'
import { estaEnRango } from '@/lib/precio'
import type { CatalogoCompleto, Color } from '@/types'

import StepTipo from '@/components/configurador/StepTipo'
import StepTela from '@/components/configurador/StepTela'
import StepColor from '@/components/configurador/StepColor'
import StepMedidas from '@/components/configurador/StepMedidas'
import StepSistema from '@/components/configurador/StepSistema'
import StepCierre from '@/components/configurador/StepCierre'
import PriceBar from '@/components/configurador/PriceBar'
import PresupuestoPanel from '@/components/presupuesto/PresupuestoPanel'
import { generarPDF } from '@/lib/pdf'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Resumen']

export default function ConfiguradorPage() {
  const {
    state,
    setTipo,
    setTela,
    setColor,
    setColorInterior,
    setColorExterior,
    setMedidas,
    setSistema,
    setInstalacion,
    setCaida,
    resetear,
  } = useConfigurador()

  const {
    items,
    agregarItem,
    eliminarItem,
    totalGeneral,
    limpiarPresupuesto,
  } = usePresupuesto()

  const [paso, setPaso] = useState(0)
  const [catalogo, setCatalogo] = useState<CatalogoCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [precio, setPrecio] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then((data: CatalogoCompleto) => setCatalogo(data))
      .catch(() => setError('Error al cargar el catálogo'))
      .finally(() => setLoading(false))
  }, [])

  const fetchPrecio = useCallback(async () => {
    const { ancho, alto, sistemaExtra, instExtra } = state
    if (!ancho || !alto || !estaEnRango(ancho, alto)) {
      setPrecio(null)
      return
    }
    try {
      const params = new URLSearchParams({
        ancho: String(ancho),
        alto: String(alto),
        sistemaExtra: String(sistemaExtra),
        instExtra: String(instExtra),
      })
      const res = await fetch(`/api/precio?${params}`)
      const data = await res.json()
      setPrecio(data.fueraDeRango ? null : data.precio)
    } catch {
      setPrecio(null)
    }
  }, [state.ancho, state.alto, state.sistemaExtra, state.instExtra])

  useEffect(() => {
    const timer = setTimeout(fetchPrecio, 300)
    return () => clearTimeout(timer)
  }, [fetchPrecio])

  const coloresFiltrados: Color[] = (catalogo?.colores ?? []).filter(
    c => c.tela_id === state.tela?.id
  )

  function irA(nuevoPaso: number) {
    if (nuevoPaso >= 0 && nuevoPaso < PASOS.length) {
      setPaso(nuevoPaso)
      window.scrollTo(0, 0)
    }
  }

  function handleClickPaso(i: number) {
    if (i < paso) irA(i)
  }

  function handleFueraDeRango() {
    const msg = generarMensajeWhatsApp(state, 0)
    const url = generarUrlWhatsApp(
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
      msg
    )
    window.open(url, '_blank')
  }

  function handleAgregarAlPresupuesto(ambiente: string) {
    if (!precio) return
    agregarItem({ ambiente, configuracion: state, precioEstimado: precio })
    resetear()
    setPaso(0)
  }

  async function handleDescargarPDF() {
    await generarPDF(items)
  }

  async function handleEnviarEmail(email: string) {
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, items }),
    })
  }

  if (loading) {
    return (
      <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#BBB', fontSize: 14 }}>Cargando configurador…</p>
      </main>
    )
  }

  if (error || !catalogo) {
    return (
      <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error ?? 'Error inesperado'}</p>
      </main>
    )
  }

  return (
    <main style={{ background: '#FAFAFA', height: 'auto', paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 0' }}>
        {items.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <PresupuestoPanel
              items={items}
              totalGeneral={totalGeneral}
              onEliminar={eliminarItem}
              onLimpiar={limpiarPresupuesto}
              onDescargarPDF={handleDescargarPDF}
              onEnviarEmail={handleEnviarEmail}
            />
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 8, padding: '40px 40px' }}>
          {paso === 0 && (
            <StepTipo
              tipos={catalogo.tipos}
              seleccionado={state.tipo}
              onSelect={tipo => { setTipo(tipo); irA(1) }}
              pasoActual={paso}
              onClickPaso={handleClickPaso}
            />
          )}

          {paso === 1 && (
            <StepTela
              telas={catalogo.telas}
              telasFiltradas={catalogo.telas.filter(t => t.tipo_id === state.tipo?.id)}
              seleccionada={state.tela}
              onSelect={tela => { setTela(tela); irA(2) }}
              pasoActual={paso}
              onClickPaso={handleClickPaso}
            />
          )}

          {paso === 2 && (
            <StepColor
              colores={catalogo.colores}
              coloresFiltrados={coloresFiltrados}
              seleccionado={state.color}
              onSelect={(color: Color) => setColor(color)}
              colorInterior={state.colorInterior}
              colorExterior={state.colorExterior}
              onSelectInterior={setColorInterior}
              onSelectExterior={setColorExterior}
              tipoNombre={state.tipo?.nombre ?? ''}
              telaNombre={state.tela?.nombre ?? ''}
              caida={state.caida}
              onCaidaChange={setCaida}
              pasoActual={paso}
              onClickPaso={handleClickPaso}
            />
          )}

          {paso === 3 && (
            <StepMedidas
              ancho={state.ancho}
              alto={state.alto}
              reglas={catalogo.precios}
              telaSeleccionada={state.tela}
              onChange={setMedidas}
              onFueraDeRango={handleFueraDeRango}
              pasoActual={paso}
              onClickPaso={handleClickPaso}
            />
          )}

          {paso === 4 && (
            <StepSistema
              sistema={state.sistema}
              instalacion={state.instalacion}
              onSistemaChange={(sis, extra) => setSistema(sis, extra)}
              onInstalacionChange={(activa, extra) => setInstalacion(activa, extra)}
              regla={catalogo.precios.find(p => p.tela_id === state.tela?.id) ?? null}
              telaNombre={state.tela?.nombre ?? ''}
              pasoActual={paso}
              onClickPaso={handleClickPaso}
            />
          )}

          {paso === 5 && (
            <StepCierre
              state={state}
              precioEstimado={precio}
              reglas={catalogo.precios}
              onAgregarAlPresupuesto={handleAgregarAlPresupuesto}
              onNuevoProducto={() => { resetear(); setPaso(0) }}
            />
          )}
        </div>
      </div>

      {paso < PASOS.length - 1 && (
        <PriceBar
          state={state}
          precio={precio}
          onNext={() => irA(paso + 1)}
          nextLabel={paso === PASOS.length - 2 ? 'Ver resumen →' : 'Siguiente →'}
          onBack={() => irA(paso - 1)}
          showBack={paso > 0}
        />
      )}
    </main>
  )
}