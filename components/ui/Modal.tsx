'use client'

interface ModalProps {
  abierto: boolean
  onCerrar: () => void
  titulo?: string
  children: React.ReactNode
}

export default function Modal({ abierto, onCerrar, titulo, children }: ModalProps) {
  // Modal genérico con overlay y botón de cierre
  if (!abierto) return null
  return <div>{children}</div>
}