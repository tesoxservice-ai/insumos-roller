import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <p
        className="text-8xl font-bold"
        style={{ color: 'var(--gold)' }}
      >
        404
      </p>

      <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
        Página no encontrada
      </h1>

      <p className="text-center max-w-sm" style={{ color: 'var(--text-muted)' }}>
        La página que buscás no existe o fue movida.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80"
        style={{
          backgroundColor: 'var(--gold)',
          color: 'var(--bg)',
          borderRadius: 'var(--radius)',
        }}
      >
        Volver al inicio
      </Link>
    </main>
  )
}