import { BatterWithFangraphsStats } from '@/lib/models/baseball';
import { CategoryOption } from '../category-breakdown.model';
import { CATEGORIES, PLAYER_COLORS } from '../const';

interface GridViewProps {
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

function fmt(cat: CategoryOption | null, val: number): string | number {
  if (cat?.isRate) return val.toFixed(3);
  return val;
}

export default function GridView({ activeCat, activeCategory, batters, totals, setHoveredPlayer, hoveredPlayer }: GridViewProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
      {batters.map(({ name, team, position, fangraphsStats }, i) => {
        if (!fangraphsStats) return null;

        const val = fangraphsStats[activeCategory as keyof typeof fangraphsStats] as number;
        const share = activeCat?.isRate ? null : toPercent(val, totals[activeCategory]);
        const color = PLAYER_COLORS[i % PLAYER_COLORS.length];

        return (
          <div
            key={name}
            className="row-item"
            onMouseEnter={() => setHoveredPlayer(name)}
            onMouseLeave={() => setHoveredPlayer(null)}
            style={{
              background: '#fff',
              border: `1.5px solid ${hoveredPlayer === name ? color : '#e8e0d0'}`,
              borderRadius: 6,
              padding: 16,
              opacity: hoveredPlayer && hoveredPlayer !== name ? 0.5 : 1,
              transition: 'all 0.15s',
              animationDelay: `${i * 0.04}s`,
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1208', lineHeight: 1.2 }}>{name}</div>
                <div style={{ fontSize: 10, color: '#8a7a5a', marginTop: 2 }}>
                  {team} · {position}
                </div>
              </div>
              <div
                style={{
                  background: color,
                  color: '#fff',
                  borderRadius: 3,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                #{i + 1}
              </div>
            </div>

            {/* All categories mini grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {CATEGORIES.map(cat => (
                <div
                  key={cat.key}
                  style={{
                    background: cat.key === activeCategory ? `${cat.color}18` : '#f5f1eb',
                    borderRadius: 3,
                    padding: '5px 8px',
                    borderLeft: cat.key === activeCategory ? `2px solid ${cat.color}` : '2px solid transparent',
                  }}
                >
                  <div style={{ fontSize: 9, color: '#8a7a5a', letterSpacing: '0.1em' }}>{cat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: cat.key === activeCategory ? cat.color : '#1a1208' }}>
                    {fmt(cat, fangraphsStats[cat.key as keyof typeof fangraphsStats] as number)}
                  </div>
                </div>
              ))}
            </div>

            {share !== null && (
              <div style={{ marginTop: 10, fontSize: 10, color: '#8a7a5a', textAlign: 'right' }}>
                <span style={{ color, fontWeight: 600 }}>{share.toFixed(1)}%</span> of roster {activeCat?.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
