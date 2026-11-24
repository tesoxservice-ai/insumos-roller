export const ANNOUNCEMENT_BAR_HEIGHT = 36

const MENSAJES = [
  'ENVÍOS A TODO EL PAÍS SIN CARGO',
  'INSTALACIÓN SIN CARGO EN CABA Y AMBA',
]

const REPETICIONES = 6

export default function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Envíos e instalación"
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 51,
        height: ANNOUNCEMENT_BAR_HEIGHT, overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: '#14008C', color: '#F0EBE3',
      }}
    >
      <div className="announcement-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {Array.from({ length: REPETICIONES }).map((_, rep) => (
          <span key={rep} aria-hidden={rep > 0} style={{ display: 'flex', alignItems: 'center' }}>
            {MENSAJES.map(texto => (
              <span key={texto} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', padding: '0 40px',
                }}>
                  {texto}
                </span>
                <span style={{ fontSize: 9, opacity: 0.45 }}>✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
      <style>{`
        .announcement-track { animation: announcement-scroll 30s linear infinite; }
        @keyframes announcement-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${100 / REPETICIONES}%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
