import { BatterWithRegressionMetrics } from '../model';

interface ListViewProps {
  activeCategory: string;
  sorted: BatterWithRegressionMetrics[];
}

export default function ListView({ activeCategory, sorted }: ListViewProps) {
  return (
    <div style={{ background: '#111111', borderRadius: 8, border: '1px solid #1f1f1f', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 70px 90px 90px 90px 100px',
          padding: '10px 16px',
          borderBottom: '1px solid #1f1f1f',
          gap: 8,
        }}
      >
        {['PLAYER', 'POS', `${activeCategory} SHARE`, 'wOBA DELTA', 'DIV SCORE', 'ACTION'].map((h, i) => (
          <div key={i} style={{ fontSize: 10, letterSpacing: '0.1em', color: '#374151', textAlign: i >= 2 ? 'right' : 'left' }}>
            {h}
          </div>
        ))}
      </div>

      {sorted.map((p, i) => (
        <div
          key={i}
          className="list-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 70px 90px 90px 90px 100px',
            padding: '11px 16px',
            borderBottom: '1px solid #18181b',
            gap: 8,
            alignItems: 'center',
            animation: `popIn 0.3s ease ${i * 0.04}s both`,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#f9fafb' }}>{p.fangraphsStats?.PlayerName}</div>
            <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>
              {p.fangraphsStats?.TeamName} · {p.fangraphsStats?.PA} PA
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>{p.fangraphsStats?.Pos}</div>
          <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#f9fafb' }}>
            {activeCategory === 'AVG' ? p.fangraphsStats?.AVG.toFixed(3) : `${p.depScore.toFixed(1)}%`}
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: 13,
              fontWeight: 600,
              color: (p.fangraphsStats?.wOBA ?? 0) - (p.fangraphsStats?.xwOBA ?? 0) > 0 ? '#f87171' : '#4ade80',
            }}
          >
            {(p.fangraphsStats?.wOBA ?? 0) - (p.fangraphsStats?.xwOBA ?? 0) > 0 ? '+' : ''}
            {((p.fangraphsStats?.wOBA ?? 0) - (p.fangraphsStats?.xwOBA ?? 0))?.toFixed(3)}
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: p.divScore > 0 ? '#f87171' : '#4ade80' }}>
            {p.divScore > 0 ? '+' : ''}
            {p.divScore.toFixed(3)}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                background: `${p.action.color}18`,
                border: `1px solid ${p.action.color}44`,
                color: p.action.color,
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {p.action.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
