import Link from 'next/link'

export default function PagoErrorPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="flex flex-col items-center text-center gap-5 max-w-sm">
        <span className="text-6xl">❌</span>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Hubo un problema con el pago
        </h1>

        <p style={{ color: 'var(--text-mid)' }}>
          No se realizó ningún cobro. Podés intentarlo nuevamente.
        </p>

        <Link
          href="/stock"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-85"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg)',
            borderRadius: 'var(--radius)',
          }}
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  )
}
