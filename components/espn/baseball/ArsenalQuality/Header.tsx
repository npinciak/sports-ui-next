interface HeaderProps {
  playerCount: number;
  view: 'matrix' | 'list';
  setView: (view: 'matrix' | 'list') => void;
}

export default function Header({ playerCount, view, setView }: HeaderProps) {
  return (
    <div style={{ borderBottom: '3px solid #1a1208', paddingBottom: 16, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
            ARSENAL QUALITY
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: '#e85d26',
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            × REGRESSION RISK
          </div>
          <div style={{ fontSize: 11, color: '#8a7a5a', marginTop: 6, letterSpacing: '0.12em' }}>
            STUFF QUALITY · BATTED BALL SUSTAINABILITY · {playerCount} PITCHERS
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['matrix', 'list'].map((value, i) => (
            <button
              key={i}
              name="tab-btn"
              onClick={() => setView(value as 'matrix' | 'list')}
              style={{
                background: view === value ? '#1a1208' : 'transparent',
                border: '1.5px solid #1a1208',
                borderRadius: value === 'matrix' ? '4px 0 0 4px' : '0 4px 4px 0',
                padding: '5px 14px',
                color: view === value ? '#faf7f2' : '#1a1208',
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
