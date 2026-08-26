'use client'

import { useEffect, useState } from 'react'
import { useConfigurador } from '@/hooks/useConfigurador'
import { usePresupuesto } from '@/hooks/usePresupuesto'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'
import type { CatalogoCompleto, Color } from '@/types'

import StepHeader from '@/components/configurador/StepHeader'
import StepTipo from '@/components/configurador/StepTipo'
import StepTela from '@/components/configurador/StepTela'
import StepColor from '@/components/configurador/StepColor'
import StepMedidas from '@/components/configurador/StepMedidas'
import StepSistema from '@/components/configurador/StepSistema'
import StepInstalacion from '@/components/configurador/StepInstalacion'
import StepCierre from '@/components/configurador/StepCierre'
import PriceBar from '@/components/configurador/PriceBar'
import PresupuestoPanel from '@/components/presupuesto/PresupuestoPanel'
import { generarPDF } from '@/lib/pdf'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Instalación', 'Cierre']

export default function ConfiguradorPage() {
  const {
    state,
    setTipo,
    setTela,
    setColor,
    setMedidas,
    setSistema,
    setInstalacion,
    calcularPrecioActual,
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

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then((data: CatalogoCompleto) => setCatalogo(data))
      .catch(() => setError('Error al cargar el catálogo'))
      .finally(() => setLoading(false))
  }, [])

  const precio = catalogo ? calcularPrecioActual(catalogo.precios) : null

  const coloresFiltrados: Color[] = (catalogo?.colores ?? []).filter(
    c => c.tela_id === state.tela?.id
  ) ?? []

  function irA(nuevoPaso: number) {
    if (nuevoPaso >= 0 && nuevoPaso < PASOS.length) {
      setPaso(nuevoPaso)
      window.scrollTo(0, 0)
    }
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
      body: JSON.stringify({
        email,
        items,
      }),
    })
  }

  if (loading) {
    return (
      <main style={{
        background: 'var(--bg)', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando configurador…</p>
      </main>
    )
  }

  if (error || !catalogo) {
    return (
      <main style={{
        background: 'var(--bg)', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#ef4444', fontSize: 14 }}>{error ?? 'Error inesperado'}</p>
      </main>
    )
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>

      <StepHeader
        pasos={PASOS}
        pasoActual={paso}
        onClickPaso={(i) => { if (i < paso) irA(i) }}
      />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 0' }}>

        {/* Panel de presupuesto si hay items */}
        {(items.length > 0 || paso === PASOS.length - 1) && (
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

        {/* Contenido del paso */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '28px 24px',
        }}>
          {paso === 0 && (
            <StepTipo
              tipos={catalogo.tipos}
              seleccionado={state.tipo}
              onSelect={tipo => { setTipo(tipo); irA(1) }}
            />
          )}

          {paso === 1 && (
            <StepTela
              telas={catalogo.telas}
              telasFiltradas={catalogo.telas.filter(t => t.tipo_id === state.tipo?.id)}
              seleccionada={state.tela}
              onSelect={tela => { setTela(tela); irA(2) }}
            />
          )}

          {paso === 2 && (
            <StepColor
              colores={catalogo.colores}
              coloresFiltrados={coloresFiltrados}
              seleccionado={state.color}
              onSelect={(color: Color) => setColor(color)}
              tipoNombre={state.tipo?.nombre ?? ''}
              telaNombre={state.tela?.nombre ?? ''}
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
            />
          )}

          {paso === 4 && (
            <StepSistema
              sistema={state.sistema}
              instalacion={state.instalacion}
              onSistemaChange={(sis, extra) => setSistema(sis, extra)}
              onInstalacionChange={(activa, extra) => setInstalacion(activa, extra)}
              regla={catalogo.precios.find(p => p.tela_id === state.tela?.id) ?? null}
            />
          )}

          {paso === 5 && (
            <StepInstalacion
              instalacion={state.instalacion}
              onChange={(activa, extra) => setInstalacion(activa, extra)}
            />
          )}

          {paso === 6 && (
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

      {/* Price bar fija abajo */}
      {paso > 0 && paso < PASOS.length - 1 && (
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