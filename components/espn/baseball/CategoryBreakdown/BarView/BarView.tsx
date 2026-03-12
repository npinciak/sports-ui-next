import { BatterWithFangraphsStats } from '@/lib/models/baseball';
import { CategoryOption } from '../category-breakdown.model';
import { PLAYER_COLORS } from '../const';

interface BarViewProps {
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

function format(cat: CategoryOption | null, val: number): string | number {
  if (cat?.isRate) return val.toFixed(3);
  return val;
}

export default function BarView({ activeCat, activeCategory, batters, totals, setHoveredPlayer, hoveredPlayer }: BarViewProps) {
  const maxVal = batters[0]?.fangraphsStats?.[activeCategory as keyof (typeof batters)[0]['fangraphsStats']] ?? 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr 70px 70px',
          gap: 12,
          padding: '0 0 8px 0',
          borderBottom: '1px solid #c8bfaa',
          marginBottom: 4,
        }}
      >
        {['PLAYER', '', activeCat?.label, 'SHARE'].map((h, i) => (
          <div key={i} style={{ fontSize: 10, letterSpacing: '0.12em', color: '#8a7a5a', textAlign: i >= 2 ? 'right' : 'left' }}>
            {h}
          </div>
        ))}
      </div>

      {batters.map(({ name, team, position, fangraphsStats }, i) => {
        if (!fangraphsStats) return null;

        const val = fangraphsStats[activeCategory as keyof typeof fangraphsStats] as number;
        const share = activeCat?.isRate ? null : toPercent(val, totals[activeCategory]);

        const barPct = activeCat?.isRate
          ? toPercent(val - 0.22, maxVal - 0.22) // normalize AVG bars from .220 baseline
          : toPercent(val, maxVal);
        const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
        const isHovered = hoveredPlayer === name;

        return (
          <div
            key={i}
            className="row-item player-row"
            onMouseEnter={() => setHoveredPlayer(name)}
            onMouseLeave={() => setHoveredPlayer(null)}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 70px 70px',
              gap: 12,
              padding: '9px 0',
              borderBottom: '1px solid #e8e0d0',
              alignItems: 'center',
              opacity: hoveredPlayer && !isHovered ? 0.45 : 1,
              animationDelay: `${i * 0.05}s`,
              transition: 'opacity 0.15s',
            }}
          >
            {/* Name */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1208' }}>{name}</div>
              <div style={{ fontSize: 10, color: '#8a7a5a', marginTop: 1 }}>
                {team} · {position}
              </div>
            </div>

            {/* Bar */}
            <div style={{ position: 'relative', height: 10 }}>
              <div style={{ position: 'absolute', inset: 0, background: '#e8e0d0', borderRadius: 2 }} />
              <div
                className="bar-fill"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.max(barPct, 2)}%`,
                  background: color,
                  borderRadius: 2,
                  //   '--target-width': `${Math.max(barPct, 2)}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            </div>

            {/* Value */}
            <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#1a1208' }}>{format(activeCat, val)}</div>

            {/* Share */}
            <div style={{ textAlign: 'right', fontSize: 12, color: '#8a7a5a' }}>{share !== null ? `${share.toFixed(1)}%` : '—'}</div>
          </div>
        );
      })}

      {/* Total row */}
      {!activeCat?.isRate && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr 70px 70px',
            gap: 12,
            padding: '10px 0 0 0',
            borderTop: '2px solid #1a1208',
            marginTop: 4,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: '#1a1208' }}>ROSTER TOTAL</div>
          <div />
          <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#1a1208' }}>{totals[activeCategory]}</div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#8a7a5a' }}>100%</div>
        </div>
      )}
    </div>
  );
}
