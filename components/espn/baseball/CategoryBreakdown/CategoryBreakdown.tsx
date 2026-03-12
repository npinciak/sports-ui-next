'use client';

import { selectBattersFangraphsStats, selectStartingBatterFangraphIds } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { useFangraphsBattingData } from '@/lib/hooks/useFangraphsBattingData';
import { FangraphsBatterStatsEntity } from '@/lib/models/fangraphs/player-stats.model';
import { useMemo, useState } from 'react';
import BarView from './BarView';
import { CategoryOption } from './category-breakdown.model';
import { CATEGORIES } from './const';
import GridView from './GridView/GridView';
import Header from './Header';
import StackedRoster from './StackedRoster';

function fmt(cat: CategoryOption, val: number): string | number {
  if (cat.isRate) return val.toFixed(3);
  return val;
}

export default function CategoryContributionBreakdown() {
  const [activeCategory, setActiveCategory] = useState('HR');
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('bar'); // bar | grid

  const activeCat = CATEGORIES.find(c => c.key === activeCategory);

  const mappedStartingBatterPlayerIds = useAppSelector(selectStartingBatterFangraphIds);

  // Use the reusable hook for fetching Fangraphs data
  const { isLoading, error } = useFangraphsBattingData(mappedStartingBatterPlayerIds);

  const batters = useAppSelector(selectBattersFangraphsStats);

  const totals = useMemo(() => {
    const out = {} as { [key: string]: number };
    CATEGORIES.forEach(category => {
      if (category.isRate) {
        // weighted avg
        const totalPlateAppearances = batters.reduce((acc, p) => {
          return acc + (p.fangraphsStats?.PA ?? 0);
        }, 0);

        out[category.key] =
          batters.reduce((acc, p) => {
            const categoryKey = category.key as keyof FangraphsBatterStatsEntity;

            const stat = typeof p.fangraphsStats?.[categoryKey] === 'number' ? p.fangraphsStats?.[categoryKey] : 0;

            return acc + stat * (p.fangraphsStats?.PA ?? 0);
          }, 0) / totalPlateAppearances;
      } else {
        out[category.key] = batters.reduce((acc, p) => {
          const categoryKey = category.key as keyof FangraphsBatterStatsEntity;
          const stat = typeof p.fangraphsStats?.[categoryKey] === 'number' ? p.fangraphsStats?.[categoryKey] : 0;
          return acc + stat;
        }, 0);
      }
    });
    return out;
  }, []);

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
        .cat-btn { transition: all 0.15s ease; cursor: pointer; }
        .cat-btn:hover { transform: translateY(-1px); }
        .player-row { transition: opacity 0.15s ease; }
        .segment:hover { filter: brightness(1.15); cursor: pointer; }
        @keyframes growRight {
          from { width: 0; }
          to { width: var(--target-width); }
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bar-fill {
          animation: growRight 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .row-item {
          animation: riseUp 0.4s ease both;
        }
      `}</style>

      {/* Masthead */}
      <Header activeCat={activeCat ?? null} batters={batters} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              className="cat-btn"
              onClick={() => setActiveCategory(cat.key)}
              style={{
                background: isActive ? cat.color : 'transparent',
                border: `2px solid ${isActive ? cat.color : '#c8bfaa'}`,
                borderRadius: 4,
                padding: '8px 20px',
                color: isActive ? '#fff' : '#6b5e3e',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.08em',
              }}
            >
              <div style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1 }}>
                {cat.isRate ? fmt(cat, totals[cat.key]) : totals[cat.key]}
              </div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.85 }}>{cat.description}</div>
            </button>
          );
        })}
      </div>

      {/* Stacked Roster Bar */}
      <StackedRoster
        activeCat={activeCat ?? null}
        activeCategory={activeCategory}
        batters={batters}
        totals={totals}
        setHoveredPlayer={setHoveredPlayer}
        hoveredPlayer={hoveredPlayer}
      />

      {/* BAR VIEW */}
      {viewMode === 'bar' && (
        <BarView
          activeCat={activeCat ?? null}
          activeCategory={activeCategory}
          batters={batters}
          totals={totals}
          setHoveredPlayer={setHoveredPlayer}
          hoveredPlayer={hoveredPlayer}
        />
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <GridView
          activeCat={activeCat ?? null}
          activeCategory={activeCategory}
          batters={batters}
          totals={totals}
          setHoveredPlayer={player => setHoveredPlayer(player)}
          hoveredPlayer={hoveredPlayer}
        />
      )}

      {/* Footer note */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #c8bfaa', fontSize: 11, color: '#a09070', lineHeight: 1.6 }}>
        Stacked bar shows each player's share of total roster production. Hover a player to isolate. Switch categories to identify who is
        indispensable vs. replaceable in each counting stat.
      </div>
    </div>
  );
}
