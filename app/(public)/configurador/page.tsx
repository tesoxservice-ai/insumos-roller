'use client'

import { useState, useEffect, useCallback } from 'react'
import { useConfigurador } from '@/hooks/useConfigurador'
import { usePresupuesto } from '@/hooks/usePresupuesto'
import type { CatalogoCompleto, ReglaPrecio } from '@/types'
import StepHeader from '@/components/configurador/StepHeader'
import StepTipo from '@/components/configurador/StepTipo'
import StepTela from '@/components/configurador/StepTela'
import StepColor from '@/components/configurador/StepColor'
import StepMedidas from '@/components/configurador/StepMedidas'
import StepSistema from '@/components/configurador/StepSistema'
import StepCierre from '@/components/configurador/StepCierre'
import PriceBar from '@/components/configurador/PriceBar'
import PresupuestoPanel from '@/components/presupuesto/PresupuestoPanel'
import { generarPDF } from '@/lib/pdf'

const PASOS = ['Tipo', 'Tela', 'Color', 'Medidas', 'Sistema', 'Cierre']

export default function ConfiguradorPage() {
  const [pasoActual, setPasoActual] = useState(0)
  const [catalogo, setCatalogo] = useState<CatalogoCompleto | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const configurador = useConfigurador()
  const presupuesto = usePresupuesto()

  const cargarCatalogo = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/catalogo')
      if (!res.ok) throw new Error('No se pudo cargar el catálogo')
      const data: CatalogoCompleto = await res.json()
      setCatalogo(data)
    } catch {
      setError('No pudimos cargar el catálogo. Verificá tu conexión.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarCatalogo()
  }, [cargarCatalogo])

  const ir = (index: number) => setPasoActual(index)
  const siguiente = () => setPasoActual((p) => Math.min(p + 1, PASOS.length - 1))
  const anterior = () => setPasoActual((p) => Math.max(p - 1, 0))

  const reglaActual: ReglaPrecio | null =
    catalogo && configurador.state.tela
      ? (catalogo.precios.find((r) => r.tela_id === configurador.state.tela!.id) ?? null)
      : null

  const precio = catalogo ? configurador.calcularPrecioActual(catalogo.precios) : null

  const mostrarPriceBar = pasoActual >= 3
  const mostrarPanel = pasoActual >= 5 || presupuesto.items.length > 0

  const handleFueraDeRango = () => {
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
    const mensaje = encodeURIComponent('Hola! Necesito asesoría para una cortina con medidas especiales.')
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank')
  }

  const handleAgregarAlPresupuesto = (ambiente: string) => {
    if (precio === null) return
    presupuesto.agregarItem({
      ambiente,
      configuracion: configurador.state,
      precioEstimado: precio,
    })
  }

  const handleNuevoProducto = () => {
    configurador.resetear()
    setPasoActual(0)
  }

  const handleEnviarEmail = async (email: string) => {
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items: presupuesto.items }),
      })
    } catch {
      // Error silencioso — el componente maneja su propio estado de UI
    }
  }

  const handleDescargarPDF = async () => {
    await generarPDF(presupuesto.items)
  }

  if (cargando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--text-muted)' }}>Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  if (error || !catalogo) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <p className="text-lg" style={{ color: 'var(--text)' }}>
            {error ?? 'Error al cargar el catálogo'}
          </p>
          <button
            onClick={cargarCatalogo}
            className="px-6 py-2 font-semibold"
            style={{
              backgroundColor: 'var(--gold)',
              color: 'var(--bg)',
              borderRadius: 'var(--radius)',
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const telasFiltradas = configurador.state.tipo
    ? catalogo.telas.filter((t) => t.tipo_id === configurador.state.tipo!.id)
    : []

  const coloresFiltrados = configurador.state.tela
    ? catalogo.colores.filter((c) => c.tela_id === configurador.state.tela!.id)
    : []

  const nextLabel = pasoActual === PASOS.length - 1 ? 'Finalizar' : 'Siguiente →'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <StepHeader
        pasos={PASOS}
        pasoActual={pasoActual}
        onClickPaso={(i) => { if (i < pasoActual) ir(i) }}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-24 px-4 md:px-8 py-6">
          {pasoActual === 0 && (
            <StepTipo
              tipos={catalogo.tipos}
              seleccionado={configurador.state.tipo}
              onSelect={(tipo) => { configurador.setTipo(tipo); setTimeout(siguiente, 200) }}
            />
          )}
          {pasoActual === 1 && (
            <StepTela
              telas={catalogo.telas}
              telasFiltradas={telasFiltradas}
              seleccionada={configurador.state.tela}
              onSelect={(tela) => { configurador.setTela(tela); setTimeout(siguiente, 200) }}
            />
          )}
          {pasoActual === 2 && (
            <StepColor
              colores={catalogo.colores}
              coloresFiltrados={coloresFiltrados}
              seleccionado={configurador.state.color}
              onSelect={(color) => { configurador.setColor(color); setTimeout(siguiente, 200) }}
            />
          )}
          {pasoActual === 3 && (
            <StepMedidas
              ancho={configurador.state.ancho}
              alto={configurador.state.alto}
              reglas={catalogo.precios}
              telaSeleccionada={configurador.state.tela}
              onChange={configurador.setMedidas}
              onFueraDeRango={handleFueraDeRango}
            />
          )}
          {pasoActual === 4 && (
            <StepSistema
              sistema={configurador.state.sistema}
              instalacion={configurador.state.instalacion}
              onSistemaChange={configurador.setSistema}
              onInstalacionChange={configurador.setInstalacion}
              regla={reglaActual}
            />
          )}
          {pasoActual === 5 && (
            <StepCierre
              state={configurador.state}
              precioEstimado={precio}
              reglas={catalogo.precios}
              onAgregarAlPresupuesto={handleAgregarAlPresupuesto}
              onNuevoProducto={handleNuevoProducto}
            />
          )}
        </main>

        {mostrarPanel && (
          <aside
            className="hidden lg:block w-80 border-l overflow-y-auto"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <PresupuestoPanel
              items={presupuesto.items}
              totalGeneral={presupuesto.totalGeneral}
              onEliminar={presupuesto.eliminarItem}
              onLimpiar={presupuesto.limpiarPresupuesto}
              onDescargarPDF={handleDescargarPDF}
              onEnviarEmail={handleEnviarEmail}
            />
          </aside>
        )}
      </div>

      {mostrarPriceBar && (
        <PriceBar
          state={configurador.state}
          precio={precio}
          onNext={siguiente}
          nextLabel={nextLabel}
          onBack={anterior}
          showBack={pasoActual > 0}
        />
      )}
    </div>
  )
}
