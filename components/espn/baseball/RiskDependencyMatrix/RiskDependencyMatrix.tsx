'use client';

import { selectBattersFangraphsStats } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { BatterWithFangraphsStats } from '@/lib/models/baseball';
import { FangraphsBatterStatsEntity } from '@/lib/models/fangraphs/player-stats.model';
import { useMemo, useState } from 'react';
import CategorySelector from './CategorySelector';
import Header from './Header';
import ListView from './ListView';
import MatrixView from './MatrixView';
import QuadrantLegend from './QuadrantLegend';

const CATS = ['HR', 'R', 'RBI', 'SB', 'AVG'];

// Compute composite divergence score: average of wOBA, AVG, SLG deltas normalized
function getDivergenceScore(p: FangraphsBatterStatsEntity) {
  if (!p) return 0;

  const wOBAd = p.wOBA - p.xwOBA;
  const AVGd = p.AVG - p.xAVG;
  const SLGd = p.SLG - p.xSLG;
  // normalize roughly to same scale (wOBA ~= AVG ~= SLG/3)
  return (wOBAd + AVGd + SLGd / 3) / 3;
}

function getCategoryDependency(player: FangraphsBatterStatsEntity, cat: string, roster: BatterWithFangraphsStats[]) {
  if (!player) return 0;
  if (cat === 'AVG') {
    // how much above/below roster avg
    const totalPA = roster.reduce((s, player) => {
      const fangraphsStats = player.fangraphsStats;

      if (!fangraphsStats) return s;

      return s + fangraphsStats.PA;
    }, 0);
    const rosterAVG =
      roster.reduce((s, player) => {
        const fangraphsStats = player.fangraphsStats;
        if (!fangraphsStats) return s;
        return s + fangraphsStats.AVG * fangraphsStats.PA;
      }, 0) / totalPA;
    const contribution = (player.AVG - rosterAVG) * (player.PA / totalPA);
    return Math.max(0, contribution * 1000); // scale to 0-100ish
  }
  const total = roster.reduce((s, player) => {
    const fangraphsStats = player.fangraphsStats;
    if (!fangraphsStats) return s;
    return s + fangraphsStats[cat as keyof BatterWithFangraphsStats['fangraphsStats']];
  }, 0);
  return total === 0 ? 0 : (player[cat as keyof BatterWithFangraphsStats['fangraphsStats']] / total) * 100;
}

function getActionLabel(div: number, dep: number) {
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
  const [view, setView] = useState('matrix'); // matrix | list

  const batterList = useAppSelector(selectBattersFangraphsStats);

  const processed = useMemo(() => {
    return batterList.map(player => {
      const divScore = getDivergenceScore(player.fangraphsStats);
      const depScore = getCategoryDependency(player.fangraphsStats, activeCategory, batterList);
      const action = getActionLabel(divScore, depScore);
      return { ...player, divScore, depScore, action };
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
      <CategorySelector categoryList={CATS} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      {/* Quadrant Legend */}
      <QuadrantLegend quadrantList={QUADRANTS} />

      {/* MATRIX VIEW */}
      {view === 'matrix' && <MatrixView players={processed} quadrants={QUADRANTS} toX={toX} toY={toY} activeCategory={activeCategory} />}

      {/* LIST VIEW */}
      {view === 'list' && <ListView activeCategory={activeCategory} sorted={sorted} />}

      {/* Footer */}
      <div style={{ marginTop: 20, fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
        <strong style={{ color: '#4b5563' }}>Divergence score</strong> is a composite of wOBA, AVG, and SLG vs. their expected counterparts.
        Positive = overperforming (regression risk). <strong style={{ color: '#4b5563' }}>Dependency</strong> = share of roster's{' '}
        {activeCategory} production.
      </div>
    </div>
  );
}
