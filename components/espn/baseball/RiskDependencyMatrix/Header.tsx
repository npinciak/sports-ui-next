interface HeaderProps {
  view: 'matrix' | 'list';
  setView: (view: 'matrix' | 'list') => void;
}

export default function Header({ view, setView }: HeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#4b5563', marginBottom: 6, textTransform: 'uppercase' }}>
            Roster Intelligence
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#f9fafb', letterSpacing: '-0.5px', lineHeight: 1 }}>
            Risk × Dependency Matrix
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
            Cross-referencing xStats divergence against category contribution — who to sell, hold, or target
          </p>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['matrix', 'list'].map(v => (
            <button
              key={v}
              className="tab-btn"
              onClick={() => setView(v as 'matrix' | 'list')}
              style={{
                background: view === v ? '#f9fafb' : 'transparent',
                border: '1px solid #27272a',
                borderRadius: v === 'matrix' ? '4px 0 0 4px' : '0 4px 4px 0',
                padding: '6px 16px',
                color: view === v ? '#0d0d0d' : '#6b7280',
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
