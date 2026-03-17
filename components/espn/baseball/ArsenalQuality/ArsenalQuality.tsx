'use client';

import { selectPitchersFangraphsStats } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { FangraphsPitcherStatsEntity } from '@/lib/models/fangraphs/player-stats.model';
import { useMemo, useState } from 'react';
import { PITCH_MAP } from './const';
import Header from './Header';
import ListView from './ListView';
import MatrixView from './MatrixView';
import { PitchArsenal, PitcherWithRegressionMetrics } from './model';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getArsenal(p: FangraphsPitcherStatsEntity) {
  return PITCH_MAP.map(pitch => ({
    ...pitch,
    pct: p ? (p[pitch.pctKey as keyof FangraphsPitcherStatsEntity] as number) : null,
    runValue: p ? (p[pitch.wKey as keyof FangraphsPitcherStatsEntity] as number) : null,
    velocity: p ? (p[pitch.vKey as keyof FangraphsPitcherStatsEntity] as number) : null,
    armAngle: p ? (p[pitch.aaKey as keyof FangraphsPitcherStatsEntity] as number) : null,
    spin: p ? (p[pitch.spKey as keyof FangraphsPitcherStatsEntity] as number) : null,
  })).filter(pm => pm.pct != null && (pm.pct as number) > 0.02);
}

function getBestPitch(p: FangraphsPitcherStatsEntity) {
  const pitches = getArsenal(p).filter((pm): pm is PitchArsenal & { runValue: number } => pm.runValue != null);
  if (!pitches.length) return null;
  return pitches.reduce((best, pitch) => (pitch.runValue > best.runValue ? pitch : best));
}

function getStuffScore(player: FangraphsPitcherStatsEntity) {
  const best = getBestPitch(player);
  return best ? best.runValue : 0;
}

// WAR-per-game proxy for luck/regression (higher WAR relative to games = over-performing)
// Use GB% and Hard% as regression signals: high GB + low Hard = sustainable
function getRegressionScore(player: FangraphsPitcherStatsEntity) {
  const gbBonus = ((player ? player['GB%'] : 0.42) - 0.42) * 2; // above/below avg
  const hardPen = ((player ? player['Hard%'] : 0.33) - 0.33) * -2; // above avg hard = bad
  const babipPen = ((player ? player['BABIP'] : 0.295) - 0.295) * -3; // low BABIP = lucky
  return gbBonus + hardPen + babipPen;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ArsenalRegressionMatrix() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'matrix' | 'list'>('matrix');
  const [detailTab, setDetailTab] = useState('arsenal');

  const pitcherList = useAppSelector(selectPitchersFangraphsStats);

  const processed = useMemo(
    () =>
      pitcherList.map(p => ({
        ...p,
        arsenal: getArsenal(p.fangraphsStats),
        bestPitch: getBestPitch(p.fangraphsStats),
        stuffScore: getStuffScore(p.fangraphsStats),
        regScore: getRegressionScore(p.fangraphsStats),
      })),
    []
  );

  const name = selected || hovered;
  const focusP = name ? processed.find(p => p.name === name) : null;

  const maxStuff = Math.max(...processed.map(p => (p.stuffScore ? p.stuffScore : 0)));
  const maxReg = Math.max(...processed.map(p => Math.abs(p.regScore)));
  const maxWAR = Math.max(...processed.map(({ fangraphsStats }) => fangraphsStats?.WAR ?? 0));

  function toSVG(p: PitcherWithRegressionMetrics) {
    const x = 28 + (p.stuffScore! / (maxStuff * 1.12)) * 428;
    const y = 18 + (0.5 - p.regScore! / (Math.max(maxReg, 0.3) * 2.4)) * 320;
    return { x, y };
  }

  const QUADRANTS = [
    { label: 'HOLD / FEATURE', color: '#d4a017', sub: 'Elite stuff · sustainable results' },
    { label: 'SELL / CAUTION', color: '#e85d26', sub: 'Elite stuff · lucky metrics' },
    { label: 'WAIVER TARGET', color: '#4a9eff', sub: 'Weaker stuff · unlucky results' },
    { label: 'STREAM / SELL', color: '#c084fc', sub: 'Weaker stuff · lucky metrics' },
  ];

  function handlePlayerClick(playerName: string) {
    setSelected(playerName);
    setView('matrix');
  }

  return (
    <div
      style={{
        fontFamily: "'DM Mono', 'Courier New', monospace",
        background: '#faf7f2',
        minHeight: '100vh',
        color: '#1a1208',
        padding: '36px 28px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; }
        .dot-g  { cursor: pointer; }
        .dot-g circle { transition: r 0.15s ease, opacity 0.15s ease; }
        .tab-btn { transition: all 0.12s; cursor: pointer; }
        .detail-tab { transition: all 0.12s; cursor: pointer; border: none; background: transparent; }
        .list-row { transition: background 0.1s; cursor: pointer; }
        .list-row:hover { background: #f0ebe0 !important; }
        .pill { cursor: pointer; transition: all 0.12s; }
        .pill:hover { opacity: 0.8; }
        @keyframes riseUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes growW  { from { width:0; } to { width:var(--w); } }
        .anim-in  { animation: riseUp 0.3s ease both; }
        .bar-fill { animation: growW 0.55s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      {/* ── Masthead ── */}
      <Header playerCount={processed.length} view={view} setView={setView} />

      {/* ── Quadrant Legend ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
        {QUADRANTS.map(q => (
          <div
            key={q.label}
            style={{
              background: '#fff',
              border: `1px solid ${q.color}44`,
              borderLeft: `3px solid ${q.color}`,
              borderRadius: 6,
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: q.color, letterSpacing: '0.08em' }}>{q.label}</div>
            <div style={{ fontSize: 10, color: '#8a7a5a', marginTop: 3, lineHeight: 1.4 }}>{q.sub}</div>
          </div>
        ))}
      </div>

      {/* ── MATRIX VIEW ── */}
      {view === 'matrix' && <MatrixView playerList={processed} />}

      {/* ── LIST VIEW ── */}
      {view === 'list' && <ListView playerList={processed} onPlayerClick={player => handlePlayerClick(player)} />}

      {/* ── Footer ── */}
      <div style={{ marginTop: 28, paddingTop: 14, borderTop: '1px solid #c8bfaa', fontSize: 11, color: '#a09070', lineHeight: 1.7 }}>
        <strong style={{ color: '#6b5e3e' }}>X-axis:</strong> Best pitch run value per 100 pitches (pfxwX/C) ·
        <strong style={{ color: '#6b5e3e' }}> Y-axis:</strong> Batted ball sustainability composite (GB%, Hard%, BABIP) ·
        <strong style={{ color: '#6b5e3e' }}> Dot size:</strong> fWAR ·<strong style={{ color: '#6b5e3e' }}> Color:</strong> Best pitch type
        · Null fields hidden gracefully.
      </div>
    </div>
  );
}
