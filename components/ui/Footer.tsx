const ITEMS = [
  {
    icono: '🏆',
    titulo: 'Calidad premium',
    desc: 'Materiales de primera selección',
  },
  {
    icono: '🛡️',
    titulo: 'Garantía',
    desc: 'Productos garantizados por 2 años',
  },
  {
    icono: '🚚',
    titulo: 'Envíos a todo el país',
    desc: 'Rápidos, seguros y con seguimiento',
  },
  {
    icono: '🙋',
    titulo: 'Asesoramiento',
    desc: 'Te acompañamos en todo el proceso',
  },
]

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Franja de beneficios */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ITEMS.map((item) => (
            <div key={item.titulo} className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">{item.icono}</span>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {item.titulo}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Copyright */}
      <div className="py-5 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2025 MaxRoller. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
