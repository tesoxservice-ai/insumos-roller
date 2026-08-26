'use client'

interface TooltipProps {
  texto: string
  children: React.ReactNode
}

export default function Tooltip({ texto, children }: TooltipProps) {
  // Tooltip accesible que muestra información adicional al hacer hover
  return <div title={texto}>{children}</div>
}