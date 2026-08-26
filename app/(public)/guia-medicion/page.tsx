const PASOS = [
  {
    titulo: 'Conseguí una cinta métrica',
    desc: 'Usá una cinta métrica rígida o de tela. Evitá medir con cordones o tiras blandas que puedan estirarse y darte medidas incorrectas.',
  },
  {
    titulo: 'Medí el ancho',
    desc: 'Medí el ancho del hueco de la ventana de soporte a soporte, de izquierda a derecha. Anotá el valor en centímetros. Si hay marco, medí desde el borde interior del marco.',
  },
  {
    titulo: 'Medí el alto',
    desc: 'Medí desde la parte superior del soporte hasta donde querés que llegue la cortina. En general se lleva hasta el alféizar o hasta el piso, según tu preferencia.',
  },
  {
    titulo: 'Verificá dos veces',
    desc: 'Volvé a medir ambas dimensiones antes de hacer el pedido. Un error de pocos centímetros puede hacer que la cortina no calce correctamente.',
  },
  {
    titulo: '¿No tenés las medidas exactas?',
    desc: 'Podés enviarnos medidas aproximadas y un asesor te contactará para confirmar antes de fabricar. También podés solicitar una visita de medición sin cargo en zonas seleccionadas.',
  },
]

export default function GuiaMedicionPage() {
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
            Guía de medición
          </h1>
          <p style={{ color: 'var(--text-mid)' }}>
            Seguí estos pasos para obtener las medidas correctas y garantizar que tu cortina quede perfecta.
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
            Tutorial paso a paso · Duración aprox. 2 minutos
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
