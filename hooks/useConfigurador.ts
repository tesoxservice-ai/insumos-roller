'use client'

import { useState, useCallback } from 'react'
import type { ConfiguradorState, TipoCortina, Tela, Color, ReglaPrecio } from '@/types'
import { calcularPrecio } from '@/lib/precio'

const estadoInicial: ConfiguradorState = {
  tipo: null,
  tela: null,
  color: null,
  colorHex: '',
  colorInterior: null,
  colorExterior: null,
  ancho: 0,
  alto: 0,
  sistema: '',
  sistemaExtra: 0,
  instalacion: false,
  instExtra: 0,
  caida: 'detras',
}

interface UseConfiguradorReturn {
  state: ConfiguradorState
  setTipo: (tipo: TipoCortina) => void
  setTela: (tela: Tela) => void
  setColor: (color: Color) => void
  setColorInterior: (color: Color) => void
  setColorExterior: (color: Color) => void
  setMedidas: (ancho: number, alto: number) => void
  setSistema: (sistema: 'manual' | 'motorizado', extra?: number) => void
  setInstalacion: (activa: boolean, extra?: number) => void
  setCaida: (caida: 'detras' | 'delante') => void
  calcularPrecioActual: (reglas: ReglaPrecio[]) => number | null
  resetear: () => void
}

export function useConfigurador(): UseConfiguradorReturn {
  const [state, setState] = useState<ConfiguradorState>(estadoInicial)

  const setTipo = useCallback((tipo: TipoCortina) => {
    setState(prev => ({
      ...prev,
      tipo,
      tela: null,
      color: null,
      colorHex: '',
      colorInterior: null,
      colorExterior: null,
    }))
  }, [])

  const setTela = useCallback((tela: Tela) => {
    setState(prev => ({
      ...prev,
      tela,
      color: null,
      colorHex: '',
      colorInterior: null,
      colorExterior: null,
    }))
  }, [])

  const setColor = useCallback((color: Color) => {
    setState(prev => ({
      ...prev,
      color,
      colorHex: color.hex,
    }))
  }, [])

  const setColorInterior = useCallback((color: Color) => {
    setState(prev => ({ ...prev, colorInterior: color }))
  }, [])

  const setColorExterior = useCallback((color: Color) => {
    setState(prev => ({ ...prev, colorExterior: color }))
  }, [])

  const setMedidas = useCallback((ancho: number, alto: number) => {
    setState(prev => ({ ...prev, ancho, alto }))
  }, [])

  const setSistema = useCallback((sistema: 'manual' | 'motorizado', extra = 0) => {
    setState(prev => ({ ...prev, sistema, sistemaExtra: extra }))
  }, [])

  const setInstalacion = useCallback((instalacion: boolean, extra = 0) => {
    setState(prev => ({ ...prev, instalacion, instExtra: instalacion ? extra : 0 }))
  }, [])

  const setCaida = useCallback((caida: 'detras' | 'delante') => {
    setState(prev => ({ ...prev, caida }))
  }, [])

  const calcularPrecioActual = useCallback(
    (reglas: ReglaPrecio[]) => calcularPrecio(state, reglas),
    [state]
  )

  const resetear = useCallback(() => {
    setState(estadoInicial)
  }, [])

  return {
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
    calcularPrecioActual,
    resetear,
  }
}