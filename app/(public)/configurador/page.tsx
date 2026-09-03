'use client'

import { useEffect, useState } from 'react'
import { useConfigurador } from '@/hooks/useConfigurador'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { CatalogoCompleto, Color } from '@/types'

import StepTipo from '@/components/configurador/StepTipo'
import StepTela from '@/components/configurador/StepTela'
import StepColor from '@/components/configurador/StepColor'
import StepMedidas from '@/components/configurador/StepMedidas'
import StepSistema from '@/components/configurador/StepSistema'
import StepCierre from '@/components/configurador/StepCierre'
import ConfiguradorMobile from '@/components/mobile/ConfiguradorMobile'
import { generarMensajeWhatsApp, generarUrlWhatsApp } from '@/lib/whatsapp'

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

  const isMobile = useIsMobile()
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

  if (isMobile) return <ConfiguradorMobile catalogo={catalogo} />

  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 0' }}>
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
              onNuevoProducto={() => { resetear(); setPaso(0) }}
              onVolver={() => irA(4)}
            />
          )}

          {/* Navegación inferior — visible en pasos intermedios */}
          {paso > 0 && paso < PASOS.length - 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid #F0F0F0',
            }}>
              <button
                onClick={() => irA(paso - 1)}
                style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1.5px solid #D0D0D0',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#555',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#14008C'
                  e.currentTarget.style.color = '#14008C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#D0D0D0'
                  e.currentTarget.style.color = '#555'
                }}
              >
                ← Atrás
              </button>

              <button
                onClick={() => irA(paso + 1)}
                style={{
                  padding: '11px 28px',
                  background: '#14008C',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.02em',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {paso === PASOS.length - 2 ? 'Ver resumen →' : 'Siguiente →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}