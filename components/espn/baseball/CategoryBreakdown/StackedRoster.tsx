'use client';
import { BatterWithFangraphsStats } from '@/lib/models/baseball';
import { FangraphsPlayerStatEntity } from '@/lib/models/fangraphs';
import { CategoryOption } from './category-breakdown.model';
import { PLAYER_COLORS } from './const';

interface StackedRosterProps {
  activeCat: CategoryOption | null;
  activeCategory: string;
  batters: BatterWithFangraphsStats[];
  totals: Record<string, number>;
  setHoveredPlayer: (name: string | null) => void;
  hoveredPlayer: string | null;
}

function toPercent(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100;
}

export default function StackedRoster({ activeCat, activeCategory, batters, totals, setHoveredPlayer, hoveredPlayer }: StackedRosterProps) {
  return (
    activeCat &&
    !activeCat.isRate && (
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: '#8a7a5a', marginBottom: 8 }}>ROSTER SHARE OF {activeCat.label}</div>
        <div style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
          {[...batters]
            .sort(
              (a, b) =>
                (b.fangraphsStats ? (b.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity] as number) : 0) -
                (a.fangraphsStats ? (a.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity] as number) : 0)
            )
            .map((p, i) => {
              if (!p.fangraphsStats) return null;

              const pct = toPercent(p.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity] as number, totals[activeCategory]);

              const fangraphs = p.fangraphsStats;

              return (
                <div
                  key={i}
                  className="segment"
                  onMouseEnter={() => setHoveredPlayer(p.name)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  title={`${p.name}: ${p.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity]} ${activeCategory} (${pct.toFixed(1)}%)`}
                  style={{
                    width: `${pct}%`,
                    background: PLAYER_COLORS[i % PLAYER_COLORS.length],
                    opacity: hoveredPlayer && hoveredPlayer !== p.name ? 0.35 : 1,
                    transition: 'opacity 0.15s, filter 0.15s',
                    minWidth: pct > 1 ? undefined : 0,
                  }}
                />
              );
            })}
        </div>
        {hoveredPlayer &&
          (() => {
            const p = batters.find(r => r.name === hoveredPlayer);
            if (!p || !p.fangraphsStats) return null;
            const pct = toPercent(p.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity] as number, totals[activeCategory]);
            return (
              <div style={{ marginTop: 6, fontSize: 12, color: '#4a3c22' }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                {' — '}
                {p.fangraphsStats[activeCategory as keyof FangraphsPlayerStatEntity]} {activeCat.label} ({pct.toFixed(1)}% of roster total)
              </div>
            );
          })()}
      </div>
    )
  );
}
