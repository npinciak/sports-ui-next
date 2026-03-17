import { useState } from 'react';
import { BatterWithRegressionMetrics } from '../model';

interface MatrixViewProps {
  players: BatterWithRegressionMetrics[];
  quadrants: any[];
  toX: (depScore: number) => number;
  toY: (divScore: number) => number;
  activeCategory: string;
}

export default function MatrixView({ players, quadrants, toX, toY, activeCategory }: MatrixViewProps) {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const hovered = hoveredPlayer ? players.find(p => p.fangraphsStats?.PlayerName === hoveredPlayer) : null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
      {/* Scatter Plot */}
      <div style={{ background: '#111111', borderRadius: 8, border: '1px solid #1f1f1f', padding: 20, position: 'relative' }}>
        {/* Axis Labels */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: '#374151',
            letterSpacing: '0.1em',
          }}
        >
          OVERPERFORMING (REGRESSION RISK) ↑
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: '#374151',
            letterSpacing: '0.1em',
          }}
        >
          ↓ UNDERPERFORMING (BUY LOW)
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            right: 12,
            transform: 'translateY(50%) rotate(90deg)',
            fontSize: 10,
            color: '#374151',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
            transformOrigin: 'right center',
          }}
        >
          HIGH {activeCategory} DEPENDENCY →
        </div>

        <svg width="100%" viewBox="0 0 500 340" style={{ display: 'block' }}>
          {/* Quadrant fills */}
          <rect x="250" y="0" width="250" height="170" fill="#dc262608" />
          <rect x="0" y="0" width="250" height="170" fill="#ea580c06" />
          <rect x="250" y="170" width="250" height="170" fill="#0284c706" />
          <rect x="0" y="170" width="250" height="170" fill="#16a34a06" />

          {/* Grid lines */}
          <line x1="250" y1="0" x2="250" y2="340" stroke="#27272a" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="0" y1="170" x2="500" y2="170" stroke="#27272a" strokeWidth="1" strokeDasharray="4,4" />

          {/* Quadrant micro-labels */}
          <text x="370" y="18" fontSize="9" fill="#dc262660" fontFamily="Outfit" fontWeight="700" textAnchor="middle">
            SELL NOW
          </text>
          <text x="120" y="18" fontSize="9" fill="#ea580c60" fontFamily="Outfit" fontWeight="700" textAnchor="middle">
            SELL HIGH
          </text>
          <text x="370" y="332" fontSize="9" fill="#0284c760" fontFamily="Outfit" fontWeight="700" textAnchor="middle">
            HOLD FIRM
          </text>
          <text x="120" y="332" fontSize="9" fill="#16a34a60" fontFamily="Outfit" fontWeight="700" textAnchor="middle">
            BUY LOW
          </text>

          {/* Dots */}
          {players.map((p, i) => {
            const cx = 20 + toX(p.depScore) * 4.6;
            const cy = toY(p.divScore) * 3.2 + 10;
            const isHov = hoveredPlayer === p.fangraphsStats?.PlayerName;
            const isDim = hoveredPlayer && !isHov;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredPlayer(p.fangraphsStats?.PlayerName ?? '')}
                onMouseLeave={() => setHoveredPlayer(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHov ? 11 : 8}
                  fill={p.action.color}
                  opacity={isDim ? 0.15 : 0.85}
                  style={{ transition: 'r 0.15s, opacity 0.15s' }}
                />
                {!isDim && (
                  <text
                    x={cx}
                    y={cy - 13}
                    textAnchor="middle"
                    fontSize={isHov ? 11 : 9}
                    fill={isDim ? '#374151' : '#e5e7eb'}
                    fontFamily="Outfit"
                    fontWeight={isHov ? 600 : 400}
                    opacity={isDim ? 0.3 : 1}
                    style={{ transition: 'opacity 0.15s' }}
                  >
                    {p.fangraphsStats?.PlayerName.split(' ')[1] || p.fangraphsStats?.PlayerName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {hovered ? (
          <div
            key={hovered.fangraphsStats?.PlayerName}
            className="anim"
            style={{
              background: '#111111',
              border: `1px solid ${hovered.action.color}44`,
              borderRadius: 8,
              padding: 18,
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb' }}>{hovered.fangraphsStats?.PlayerName}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {hovered.fangraphsStats?.TeamName} · {hovered.fangraphsStats?.Pos} · {hovered.fangraphsStats?.PA} PA
                </div>
              </div>
              <span
                style={{
                  background: hovered.action.color,
                  color: '#fff',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                {hovered.action.label}
              </span>
            </div>

            {/* xStats */}
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.1em', marginBottom: 8 }}>XSTATS DIVERGENCE</div>
            {[
              { label: 'wOBA', actual: hovered.fangraphsStats?.wOBA, expected: hovered.fangraphsStats?.xwOBA },
              { label: 'AVG', actual: hovered.fangraphsStats?.AVG, expected: hovered.fangraphsStats?.xAVG },
              { label: 'SLG', actual: hovered.fangraphsStats?.SLG, expected: hovered.fangraphsStats?.xSLG },
            ].map(m => {
              const d = (m.actual ?? 0) - (m.expected ?? 0);
              const isPos = d > 0;
              return (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 36, fontSize: 10, color: '#9ca3af' }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#f9fafb', width: 44 }}>{m.actual?.toFixed(3)}</div>
                  <div style={{ fontSize: 10, color: '#4b5563', width: 16 }}>vs</div>
                  <div style={{ fontSize: 12, color: '#6b7280', width: 44 }}>{m.expected?.toFixed(3)}</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isPos ? '#f87171' : '#4ade80',
                      marginLeft: 'auto',
                    }}
                  >
                    {isPos ? '+' : ''}
                    {d.toFixed(3)}
                  </div>
                </div>
              );
            })}

            <div style={{ height: 1, background: '#27272a', margin: '12px 0' }} />

            {/* Category dependency */}
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.1em', marginBottom: 8 }}>{activeCategory} DEPENDENCY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1, height: 8, background: '#1f1f1f', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(hovered.depScore, 100)}%`,
                    background: hovered.action.color,
                    borderRadius: 4,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: hovered.action.color, width: 44, textAlign: 'right' }}>
                {hovered.depScore.toFixed(1)}%
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
              {hovered.fangraphsStats?.PlayerName.split(' ')[0]} accounts for{' '}
              <strong style={{ color: '#e5e7eb' }}>{hovered.depScore.toFixed(1)}%</strong> of your roster's {activeCategory} production.
            </div>

            <div style={{ height: 1, background: '#27272a', margin: '12px 0' }} />

            {/* Recommendation */}
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.1em', marginBottom: 6 }}>RECOMMENDATION</div>
            <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
              {quadrants.find(
                q =>
                  (q.y === 'over' ? hovered.divScore > 0 : hovered.divScore <= 0) &&
                  (q.x === 'high' ? hovered.depScore > 20 : hovered.depScore <= 20)
              )?.desc || "Monitor this player's underlying metrics over the next 2–3 weeks before acting."}
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: 8,
              padding: 18,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 28, opacity: 0.15 }}>◎</div>
            <div style={{ fontSize: 12, color: '#374151', textAlign: 'center', lineHeight: 1.6 }}>
              Hover a player on the matrix to see their full divergence breakdown and trade recommendation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
