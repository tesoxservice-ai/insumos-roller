const PASOS = [
  {
    titulo: 'Verificá el contenido del paquete',
    desc: 'Abrí el paquete y revisá que estén todos los componentes: la cortina enrollada, los dos soportes laterales, los tornillos y tarugos, y el tope de cadena si corresponde.',
  },
  {
    titulo: 'Marcá la posición de los soportes',
    desc: 'Usando una cinta métrica y un lápiz, marcá la posición donde irán los dos soportes. Deben quedar equidistantes del borde de la ventana y a la misma altura. Usá un nivel de burbuja para asegurarte.',
  },
  {
    titulo: 'Hacé los agujeros',
    desc: 'Con un taladro y una mecha adecuada para el material de tu pared (hormigón, yeso, madera), realizá los agujeros en las marcas. La profundidad debe ser de al menos 3 cm para asegurar una buena fijación.',
  },
  {
    titulo: 'Fijá los soportes',
    desc: 'Insertá los tarugos en los agujeros, alineá los soportes y atornillá firmemente. Verificá que queden bien nivelados tirando de ellos suavemente antes de colocar la cortina.',
  },
  {
    titulo: 'Encajá la cortina',
    desc: 'Con los soportes fijos, encajá la barra de la cortina en los soportes comenzando por el lado del mecanismo. Escucharás un clic cuando quede bien fijada. Probá el enrollado y ajustá el tope de cadena si es necesario.',
  },
]

export default function GuiaInstalacionPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">

        {/* Hero */}
        <div className="flex flex-col gap-3 mb-12">
          <span
            className="self-start text-xs font-semibold px-3 py-1"
            style={{
              backgroundColor: 'var(--gold-soft)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold)',
              borderRadius: '100px',
            }}
          >
            ✦ Guías MaxRoller
          </span>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text)' }}>
            Cómo instalar
          </h1>
          <p style={{ color: 'var(--text-mid)' }}>
            Instalá tu cortina en pocos pasos con las herramientas correctas. La mayoría de las personas lo hace en menos de 30 minutos.
          </p>
        </div>

        {/* Placeholder video */}
        <div
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 mb-12"
          style={{
            height: '320px',
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <span className="text-5xl opacity-40">▶️</span>
          <p className="font-semibold" style={{ color: 'var(--text-mid)' }}>
            Acá va a estar el video
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Tutorial de instalación paso a paso · Duración aprox. 3 minutos
          </p>
        </div>

        {/* Pasos */}
        <div className="flex flex-col gap-5">
          {PASOS.map((paso, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              {/* Número circular */}
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--bg)' }}
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  {paso.titulo}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {paso.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
