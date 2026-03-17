'use client';

import { selectBattersFangraphsStats, selectPitchersFangraphsStats } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { useMemo, useState } from 'react';
import DeltaBar from './DeltaBar';
import Legend from './Legend';
import SummaryChipList from './SummaryChipList';
import TableHeader from './TableHeader';

const METRICS = [
  { key: 'wOBA', xKey: 'xwOBA', label: 'wOBA', format: (value: number | null) => (value ? value.toFixed(3) : null) },
  { key: 'AVG', xKey: 'xAVG', label: 'AVG', format: (value: number | null) => (value ? value.toFixed(3) : null) },
  { key: 'SLG', xKey: 'xSLG', label: 'SLG', format: (value: number | null) => (value ? value.toFixed(3) : null) },
];

function getDelta(actual: number | null, expected: number | null) {
  if (actual == null || expected == null) return 0;
  return actual - expected;
}

function getDeltaLabel(delta: number, metric: string) {
  const abs = Math.abs(delta);
  const threshold = metric === 'wOBA' ? 0.015 : metric === 'SLG' ? 0.025 : 0.015;
  if (abs < threshold * 0.5) return 'neutral';
  if (delta > 0) return 'overperforming';
  return 'underperforming';
}

export default function XStatsDivergencePanel() {
  const [activeMetric, setActiveMetric] = useState('wOBA');
  const [sortBy, setSortBy] = useState('delta'); // delta | name | actual
  const [filter, setFilter] = useState('all'); // all | overperforming | underperforming

  const metric = METRICS.find(m => m.key === activeMetric);

  const batters = useAppSelector(selectBattersFangraphsStats);
  const pitchers = useAppSelector(selectPitchersFangraphsStats);

  const processed = useMemo(() => {
    return batters.map(p => {
      if (!p.fangraphsStats) {
        return { ...p, actual: null, expected: null, delta: 0, status: 'neutral' };
      }

      const actual = p.fangraphsStats[metric?.key as keyof typeof p.fangraphsStats] as number | null;
      const expected = p.fangraphsStats[metric?.xKey as keyof typeof p.fangraphsStats] as number | null;
      const delta = getDelta(actual, expected);
      const status = getDeltaLabel(delta, metric?.key as keyof typeof p.fangraphsStats);
      return { ...p, actual, expected, delta, status };
    });
  }, [batters, metric]);

  const filtered = useMemo(() => {
    let data = filter === 'all' ? processed : processed.filter(p => p.status === filter);
    if (sortBy === 'delta') return [...data].sort((a, b) => b.delta - a.delta);
    if (sortBy === 'name') return [...data].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'actual') return [...data].sort((a, b) => (b.actual ?? 0) - (a.actual ?? 0));
    return data;
  }, [processed, sortBy, filter]);

  const overCount = processed.filter(p => p.status === 'overperforming').length;
  const underCount = processed.filter(p => p.status === 'underperforming').length;

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        background: '#020B18',
        minHeight: '100vh',
        color: '#94a3b8',
        padding: '32px 24px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
        .row-hover:hover { background: #0c1829 !important; }
        .chip:hover { opacity: 0.85; cursor: pointer; }
        .btn:hover { border-color: #22d3ee !important; color: #22d3ee !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
            xSTATS DIVERGENCE
          </span>
          <span style={{ fontSize: 11, color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase' }}>roster panel</span>
        </div>
        <p style={{ fontSize: 12, color: '#fff', margin: 0, lineHeight: 1.6 }}>
          Actual vs. expected performance. <span style={{ color: '#22d3ee' }}>Cyan</span> = overperforming (regression risk) ·{' '}
          <span style={{ color: '#f87171' }}>Red</span> = underperforming (buy low)
        </p>
      </div>

      {/* Summary Chips */}
      <SummaryChipList
        playerAmount={processed.length}
        overPerformingAmount={overCount}
        underPerformingAmount={underCount}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Controls */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {METRICS.map(m => (
            <button
              key={m.key}
              className="btn"
              onClick={() => setActiveMetric(m.key)}
              style={{
                background: activeMetric === m.key ? '#0f2744' : 'transparent',
                border: `1px solid ${activeMetric === m.key ? '#22d3ee' : '#1e293b'}`,
                borderRadius: activeMetric === m.key ? 4 : 4,
                padding: '5px 16px',
                color: activeMetric === m.key ? '#22d3ee' : '#fff',
                fontFamily: 'inherit',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontWeight: activeMetric === m.key ? 600 : 400,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 11, color: '#fff', letterSpacing: '0.08em' }}>SORT</span>
          {['delta', 'actual', 'name'].map(s => (
            <button
              key={s}
              className="btn"
              onClick={() => setSortBy(s)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px 8px',
                color: sortBy === s ? '#f1f5f9' : '#334155',
                fontFamily: 'inherit',
                fontSize: 11,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: sortBy === s ? '1px solid #22d3ee' : '1px solid transparent',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <TableHeader activeMetric={activeMetric} />

      {/* Rows */}
      <div>
        {
          // (
          //   // Loading skeleton rows
          //   Array.from({ length: 5 }).map((_, i) => (
          //     <div
          //       key={i}
          //       style={{
          //         display: 'grid',
          //         gridTemplateColumns: '180px 60px 90px 90px 90px 180px 80px',
          //         gap: 0,
          //         padding: '10px 16px',
          //         background: i % 2 === 0 ? '#020B18' : '#040f1e',
          //         borderBottom: '1px solid #06122a',
          //         alignItems: 'center',
          //       }}
          //     >
          //       {Array.from({ length: 7 }).map((_, j) => (
          //         <div
          //           key={j}
          //           style={{
          //             height: 12,
          //             background: '#1e293b',
          //             borderRadius: 2,
          //             animation: `pulse 2s ease-in-out infinite`,
          //             animationDelay: `${i * 0.1 + j * 0.05}s`,
          //             width: j === 0 ? '120px' : j === 1 ? '30px' : '60px',
          //             marginLeft: j >= 2 ? 'auto' : 0,
          //           }}
          //         />
          //       ))}
          //     </div>
          //   ))
          // )
          filtered.map((player, i) => {
            const isPos = player.delta > 0;
            const statusColor = player.status === 'overperforming' ? '#22d3ee' : player.status === 'underperforming' ? '#f87171' : '#fff';
            const bgColor = i % 2 === 0 ? '#020B18' : '#040f1e';

            const fangraphs = player.fangraphsStats;

            return (
              <div
                key={i}
                className="row-hover"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 60px 90px 90px 90px 180px 80px',
                  gap: 0,
                  padding: '10px 16px',
                  background: bgColor,
                  borderBottom: '1px solid #06122a',
                  alignItems: 'center',
                  transition: 'background 0.1s',
                  animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                }}
              >
                {/* Name */}
                <div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{player.name}</div>
                  <div style={{ fontSize: 10, color: '#fff', marginTop: 1 }}>
                    {fangraphs?.TeamName} · {fangraphs?.PA} PA
                  </div>
                </div>

                {/* Pos */}
                <div style={{ fontSize: 11, color: '#fff' }}>{player?.position}</div>

                {/* Actual */}
                <div style={{ textAlign: 'right', fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{metric?.format(player.actual)}</div>

                {/* Expected */}
                <div style={{ textAlign: 'right', fontSize: 13, color: '#fff' }}>{metric?.format(player.expected)}</div>

                {/* Delta */}
                <div style={{ textAlign: 'right', fontSize: 13, color: statusColor, fontWeight: 600 }}>
                  {isPos ? '+' : ''}
                  {metric?.format(player.delta)}
                </div>

                {/* Bar */}
                <div style={{ paddingLeft: 8 }}>
                  <DeltaBar delta={player.delta} />
                </div>

                {/* Status Badge */}
                <div style={{ textAlign: 'right' }}>
                  {player.status !== 'neutral' && (
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        color: statusColor,
                        border: `1px solid ${statusColor}22`,
                        background: `${statusColor}11`,
                        borderRadius: 3,
                        padding: '2px 6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {player.status === 'overperforming' ? 'REGRESS?' : 'BUY LOW'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Legend */}
      <Legend />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
