// Tipos centrales del sistema MaxRoller

export interface TipoCortina {
  id: string
  nombre: string
  descripcion: string
  tooltip: string
  imagen_url: string
  activo: boolean
  orden: number
}

export interface Tela {
  id: string
  tipo_id: string
  nombre: string
  descripcion: string
  tooltip: string
  checks: string[]
  imagen_url: string
  activo: boolean
  orden: number
}

export interface Color {
  id: string
  tela_id: string
  nombre: string
  hex: string
  activo: boolean
  orden: number
}

export interface ReglaPrecio {
  id: string
  tela_id: string
  precio_m2: number
  motorizada_extra: number
  instalacion_extra: number
  minimo_ancho: number
  maximo_ancho: number
  minimo_alto: number
  maximo_alto: number
}

export interface ProductoStock {
  id: string
  tela_id: string
  color_id: string
  nombre: string
  ancho_cm: number
  alto_cm: number
  precio: number
  activo: boolean
  stock_cantidad: number
}

export interface Cotizacion {
  id: string
  tipo: string
  tela: string
  color: string
  ancho_cm: number
  alto_cm: number
  sistema: string
  con_instalacion: boolean
  precio_estimado: number
  email_cliente: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- items puede contener cualquier estructura de ambiente
  items: any[]
  estado: 'pendiente' | 'enviada' | 'aceptada' | 'rechazada'
  created_at: string
}

export interface ConfiguradorState {
  tipo: TipoCortina | null
  tela: Tela | null
  color: Color | null
  colorHex: string
  ancho: number
  alto: number
  sistema: 'manual' | 'motorizado' | ''
  sistemaExtra: number
  instalacion: boolean
  instExtra: number
}

export interface ItemPresupuesto {
  ambiente: string
  configuracion: ConfiguradorState
  precioEstimado: number
}

export interface CatalogoCompleto {
  tipos: TipoCortina[]
  telas: Tela[]
  colores: Color[]
  precios: ReglaPrecio[]
}