import Link from 'next/link'

export default function PagoPendientePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="flex flex-col items-center text-center gap-5 max-w-sm">
        <span className="text-6xl">⏳</span>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Pago en proceso
        </h1>

        <p style={{ color: 'var(--text-mid)' }}>
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
        </p>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-85"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg)',
            borderRadius: 'var(--radius)',
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
