'use client';

import { selectBattersFangraphsStats } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { useMemo, useState } from 'react';
import Header from './Header';

const CATS = ['HR', 'R', 'RBI', 'SB', 'AVG'];

// Compute composite divergence score: average of wOBA, AVG, SLG deltas normalized
function getDivergenceScore(p) {
  const wOBAd = p.wOBA - p.xwOBA;
  const AVGd = p.AVG - p.xAVG;
  const SLGd = p.SLG - p.xSLG;
  // normalize roughly to same scale (wOBA ~= AVG ~= SLG/3)
  return (wOBAd + AVGd + SLGd / 3) / 3;
}

function getCategoryDependency(player, cat, roster) {
  if (cat === 'AVG') {
    // how much above/below roster avg
    const totalPA = roster.reduce((s, p) => s + p.PA, 0);
    const rosterAVG = roster.reduce((s, p) => s + p.AVG * p.PA, 0) / totalPA;
    const contribution = (player.AVG - rosterAVG) * (player.PA / totalPA);
    return Math.max(0, contribution * 1000); // scale to 0-100ish
  }
  const total = roster.reduce((s, p) => s + p[cat], 0);
  return total === 0 ? 0 : (player[cat] / total) * 100;
}

function getActionLabel(div, dep) {
  if (div > 0.012 && dep > 22) return { label: 'URGENT SELL', color: '#dc2626', bg: '#fef2f2', priority: 4 };
  if (div > 0.012 && dep <= 22) return { label: 'SELL HIGH', color: '#ea580c', bg: '#fff7ed', priority: 3 };
  if (div < -0.012 && dep > 22) return { label: 'HOLD FIRM', color: '#0284c7', bg: '#f0f9ff', priority: 2 };
  if (div < -0.012 && dep <= 22) return { label: 'BUY LOW', color: '#16a34a', bg: '#f0fdf4', priority: 1 };
  return { label: 'MONITOR', color: '#6b7280', bg: '#f9fafb', priority: 0 };
}

const QUADRANTS = [
  {
    id: 'sell-urgent',
    x: 'high',
    y: 'over',
    label: 'SELL NOW',
    sublabel: 'High dependency + overperforming',
    color: '#dc2626',
    desc: 'You are at peak value. These players carry your categories AND are due for regression. Maximum trade leverage.',
  },
  {
    id: 'sell-high',
    x: 'low',
    y: 'over',
    label: 'SELL HIGH',
    sublabel: 'Low dependency + overperforming',
    color: '#ea580c',
    desc: 'Outperforming expectations but not critical to your roster. Clean sell with minimal category risk.',
  },
  {
    id: 'hold-firm',
    x: 'high',
    y: 'under',
    label: 'HOLD FIRM',
    sublabel: 'High dependency + underperforming',
    color: '#0284c7',
    desc: 'Struggling but essential. Hold and wait for regression to the mean — dropping would be costly.',
  },
  {
    id: 'buy-low',
    x: 'low',
    y: 'under',
    label: 'BUY LOW',
    sublabel: 'Low dependency + underperforming',
    color: '#16a34a',
    desc: 'Target on other rosters. Unlucky production masking quality underlying stats.',
  },
];

export default function RiskDependencyMatrix() {
  const [activeCategory, setActiveCategory] = useState('HR');
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [view, setView] = useState('matrix'); // matrix | list

  const batterList = useAppSelector(selectBattersFangraphsStats);

  const processed = useMemo(() => {
    return batterList.map(p => {
      const divScore = getDivergenceScore(p);
      const depScore = getCategoryDependency(p, activeCategory, batterList);
      const action = getActionLabel(divScore, depScore);
      return { ...p, divScore, depScore, action };
    });
  }, [activeCategory, batterList]);

  const maxDep = Math.max(...processed.map(p => p.depScore));
  const maxDiv = Math.max(...processed.map(p => Math.abs(p.divScore)));

  // For scatter: x = dependency (0-100%), y = divergence (-max to +max)
  function toX(dep: number) {
    return (dep / (maxDep * 1.15)) * 100;
  }
  function toY(div: number) {
    return 50 - (div / (maxDiv * 1.3)) * 50;
  }

  const sorted = [...processed].sort((a, b) => b.action.priority - a.action.priority || b.depScore - a.depScore);

  const hovered = hoveredPlayer ? processed.find(p => p.fangraphsStats?.Name === hoveredPlayer) : null;

  return (
    <div
      style={{
        fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
        background: '#0d0d0d',
        minHeight: '100vh',
        color: '#e5e7eb',
        padding: '32px 28px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        .dot { transition: r 0.15s, opacity 0.15s; cursor: pointer; }
        .dot:hover { r: 10px; }
        .tab-btn { transition: all 0.12s; cursor: pointer; }
        .tab-btn:hover { background: #1a1a1a !important; }
        .cat-pill { transition: all 0.12s; cursor: pointer; }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim { animation: popIn 0.35s ease both; }
        .list-row { transition: background 0.1s; }
        .list-row:hover { background: #1a1a1a !important; }
      `}</style>

      {/* Header */}
      <Header view={view as 'matrix' | 'list'} setView={setView} />

      {/* Category selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#4b5563', letterSpacing: '0.1em', marginRight: 4 }}>CATEGORY</span>
        {CATS.map(cat => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              className="cat-pill"
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive ? '#f9fafb' : '#18181b',
                border: `1px solid ${isActive ? '#f9fafb' : '#27272a'}`,
                borderRadius: 20,
                padding: '4px 14px',
                color: isActive ? '#0d0d0d' : '#9ca3af',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Quadrant Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {QUADRANTS.map(q => (
          <div
            key={q.id}
            style={{
              background: '#111111',
              border: `1px solid ${q.color}33`,
              borderLeft: `3px solid ${q.color}`,
              borderRadius: 6,
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: q.color, letterSpacing: '0.08em' }}>{q.label}</div>
            <div style={{ fontSize: 10, color: '#4b5563', marginTop: 3, lineHeight: 1.4 }}>{q.sublabel}</div>
          </div>
        ))}
      </div>

      {/* MATRIX VIEW */}
      {view === 'matrix' && (
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
              {processed.map((p, i) => {
                const cx = 20 + toX(p.depScore) * 4.6;
                const cy = toY(p.divScore) * 3.2 + 10;
                const isHov = hoveredPlayer === p.fangraphsStats?.Name;
                const isDim = hoveredPlayer && !isHov;
                return (
                  <g
                    key={p.fangraphsStats?.Name}
                    onMouseEnter={() => setHoveredPlayer(p.fangraphsStats?.Name)}
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
                        {p.fangraphsStats?.Name.split(' ')[1] || p.fangraphsStats?.Name}
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
                key={hovered.fangraphsStats?.Name}
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
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb' }}>{hovered.fangraphsStats?.Name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                      {hovered.fangraphsStats.Team} · {hovered.fangraphsStats.Pos} · {hovered.fangraphsStats.PA} PA
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
                  { label: 'wOBA', actual: hovered.fangraphsStats.wOBA, expected: hovered.fangraphsStats.xwOBA },
                  { label: 'AVG', actual: hovered.fangraphsStats.AVG, expected: hovered.fangraphsStats.xAVG },
                  { label: 'SLG', actual: hovered.fangraphsStats.SLG, expected: hovered.fangraphsStats.xSLG },
                ].map(m => {
                  const d = m.actual - m.expected;
                  const isPos = d > 0;
                  return (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 36, fontSize: 10, color: '#9ca3af' }}>{m.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f9fafb', width: 44 }}>{m.actual.toFixed(3)}</div>
                      <div style={{ fontSize: 10, color: '#4b5563', width: 16 }}>vs</div>
                      <div style={{ fontSize: 12, color: '#6b7280', width: 44 }}>{m.expected.toFixed(3)}</div>
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
                  {hovered.fangraphsStats?.Name.split(' ')[0]} accounts for{' '}
                  <strong style={{ color: '#e5e7eb' }}>{hovered.depScore.toFixed(1)}%</strong> of your roster's {activeCategory} production.
                </div>

                <div style={{ height: 1, background: '#27272a', margin: '12px 0' }} />

                {/* Recommendation */}
                <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.1em', marginBottom: 6 }}>RECOMMENDATION</div>
                <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
                  {QUADRANTS.find(
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
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
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
              key={p.fangraphsStats?.Name}
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
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f9fafb' }}>{p.fangraphsStats?.Name}</div>
                <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>
                  {p.fangraphsStats.Team} · {p.fangraphsStats.PA} PA
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{p.fangraphsStats.Pos}</div>
              <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#f9fafb' }}>
                {activeCategory === 'AVG' ? p.fangraphsStats.AVG.toFixed(3) : `${p.depScore.toFixed(1)}%`}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontSize: 13,
                  fontWeight: 600,
                  color: p.fangraphsStats.wOBA - p.fangraphsStats.xwOBA > 0 ? '#f87171' : '#4ade80',
                }}
              >
                {p.fangraphsStats.wOBA - p.fangraphsStats.xwOBA > 0 ? '+' : ''}
                {(p.fangraphsStats.wOBA - p.fangraphsStats.xwOBA).toFixed(3)}
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
      )}

      {/* Footer */}
      <div style={{ marginTop: 20, fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
        <strong style={{ color: '#4b5563' }}>Divergence score</strong> is a composite of wOBA, AVG, and SLG vs. their expected counterparts.
        Positive = overperforming (regression risk). <strong style={{ color: '#4b5563' }}>Dependency</strong> = share of roster's{' '}
        {activeCategory} production.
      </div>
    </div>
  );
}
