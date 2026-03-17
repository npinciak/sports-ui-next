import { PitcherWithRegressionMetrics } from '../model';

interface ScatterChartProps {
  playerList: PitcherWithRegressionMetrics[];
  selected: string | null;
  hovered: string | null;
  setSelected: (name: string | null) => void;
  setHovered: (name: string | null) => void;
}

export default function ScatterChart({ playerList, selected, hovered, setSelected, setHovered }: ScatterChartProps) {
  const name = selected || hovered;
  const focusP = name ? playerList.find(p => p.name === name) : null;

  const maxStuff = Math.max(...playerList.map(p => p.stuffScore!));
  const maxReg = Math.max(...playerList.map(p => Math.abs(p.regScore)));
  const maxWAR = Math.max(...playerList.map(({ fangraphsStats }) => fangraphsStats?.WAR ?? 0));

  function toSVG(p: PitcherWithRegressionMetrics) {
    const x = 28 + (p.stuffScore! / (maxStuff * 1.12)) * 428;
    const y = 18 + (0.5 - p.regScore / (Math.max(maxReg, 0.3) * 2.4)) * 320;
    return { x, y };
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8e0d0', borderRadius: 8, padding: '16px 16px 32px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9,
          color: '#c8bfaa',
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
        }}
      >
        ↑ SUSTAINABLE (high GB, low Hard)
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9,
          color: '#c8bfaa',
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
        }}
      >
        REGRESSION RISK (low GB, high Hard, low BABIP) ↓
      </div>
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: 9,
          color: '#c8bfaa',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
        }}
      >
        WEAK STUFF ←
      </div>
      <div
        style={{
          position: 'absolute',
          right: 4,
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          fontSize: 9,
          color: '#c8bfaa',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
        }}
      >
        → ELITE STUFF
      </div>

      <svg width="100%" viewBox="0 0 480 360" style={{ display: 'block', overflow: 'visible' }}>
        <rect x="0" y="0" width="240" height="180" fill="#d4a01706" />
        <rect x="240" y="0" width="240" height="180" fill="#e85d2606" />
        <rect x="0" y="180" width="240" height="180" fill="#4a9eff06" />
        <rect x="240" y="180" width="240" height="180" fill="#c084fc06" />
        <line x1="240" y1="0" x2="240" y2="360" stroke="#e8e0d0" strokeWidth="1.5" strokeDasharray="5,4" />
        <line x1="0" y1="180" x2="480" y2="180" stroke="#e8e0d0" strokeWidth="1.5" strokeDasharray="5,4" />
        <text x="120" y="15" fontSize="8" fill="#d4a01760" fontFamily="Playfair Display" fontWeight="700" textAnchor="middle">
          HOLD / FEATURE
        </text>
        <text x="360" y="15" fontSize="8" fill="#e85d2660" fontFamily="Playfair Display" fontWeight="700" textAnchor="middle">
          SELL / CAUTION
        </text>
        <text x="120" y="354" fontSize="8" fill="#4a9eff60" fontFamily="Playfair Display" fontWeight="700" textAnchor="middle">
          WAIVER TARGET
        </text>
        <text x="360" y="354" fontSize="8" fill="#c084fc60" fontFamily="Playfair Display" fontWeight="700" textAnchor="middle">
          STREAM / SELL
        </text>

        {playerList.map((p, i) => {
          const { x, y } = toSVG(p);
          const bestPitch = p.bestPitch;
          const bestPitchColor = bestPitch ? bestPitch.color : '#8a7a5a';
          const isHovered = name === p.name;
          const isDim = name && !isHovered;
          // WAR circle size
          const r = 6 + ((p.fangraphsStats?.WAR ?? 0) / maxWAR) * 5;

          return (
            <g
              key={i}
              name="dot-g"
              onMouseEnter={() => setHovered(p.name)}
              onMouseLeave={() => setHovered(null)}
              // onClick={() => setSelected((s: string) => (s === p.name ? null : p.name))}
            >
              {isHovered && <circle cx={x} cy={y} r={r + 9} fill={bestPitchColor} opacity={0.12} />}
              {selected === p.name && (
                <circle cx={x} cy={y} r={r + 6} fill="none" stroke="#1a1208" strokeWidth={1.5} strokeDasharray="3,3" />
              )}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? r + 3 : r}
                fill={bestPitchColor}
                opacity={isDim ? 0.1 : 0.88}
                stroke={isHovered ? '#1a1208' : 'transparent'}
                strokeWidth={1.2}
              />
              {!isDim && (
                <text
                  x={x}
                  y={y - r - 5}
                  textAnchor="middle"
                  fontSize={isHovered ? 11 : 9}
                  fill="#1a1208"
                  fontFamily="Playfair Display"
                  fontWeight={isHovered ? '700' : '400'}
                  opacity={isDim ? 0.1 : 1}
                >
                  {p.name.split(' ')[1] || p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 10, color: '#c8bfaa', textAlign: 'center', marginTop: -16 }}>
        Circle size = WAR · Color = best pitch type · Click to pin
      </div>
    </div>
  );
}
