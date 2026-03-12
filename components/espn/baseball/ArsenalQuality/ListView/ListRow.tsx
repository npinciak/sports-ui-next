import { PitcherWithRegressionMetrics } from '../model';

interface ListRowProps {
  player: PitcherWithRegressionMetrics;
  listIndex: number;
  onClick: () => void;
}

function pct(value: number | null | undefined) {
  return value != null ? `${(value * 100).toFixed(1)}%` : '—';
}
function dec(value: number | null | undefined, d = 2) {
  return value != null ? value.toFixed(d) : '—';
}
function rpm(value: number | null | undefined) {
  return value != null ? `${Math.round(value)}` : '—';
}

export default function ListRow({ player, listIndex, onClick }: ListRowProps) {
  const playerName = player.name;

  const team = player.team;
  const age = player.fangraphsStats?.Age;
  const stats = player.fangraphsStats;

  const bestPitch = player.bestPitch;

  const strikeoutPercent = stats?.['K%'];
  const walkPercent = stats?.['BB%'];
  const swstrPercent = stats?.['SwStr%'];

  return (
    <div
      data-name="list-row anim-in"
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 50px 55px 55px 55px 60px 70px 100px',
        padding: '11px 16px',
        borderBottom: '1px solid #f0ebe0',
        gap: 8,
        alignItems: 'center',
        animationDelay: `${listIndex * 0.04}s`,
      }}
    >
      <div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700 }}>{playerName}</div>
        <div style={{ fontSize: 10, color: '#8a7a5a' }}>
          {team} · Age {age}
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#6b5e3e' }}>{stats?.G}</div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#1a1208' }}>{dec(stats?.WAR)}</div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#1a1208' }}>{pct(strikeoutPercent)}</div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#1a1208' }}>{pct(walkPercent)}</div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#1a1208' }}>{pct(swstrPercent)}</div>
      <div style={{ textAlign: 'right' }}>
        {bestPitch ? (
          <span
            style={{
              background: `${bestPitch.color}22`,
              color: bestPitch.color,
              border: `1px solid ${bestPitch.color}44`,
              borderRadius: 3,
              padding: '2px 7px',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {bestPitch.label} +{dec(bestPitch.rv, 1)}
          </span>
        ) : (
          <span style={{ color: '#c8bfaa' }}>—</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {player.arsenal.slice(0, 3).map(pm => (
          <span
            key={pm.label}
            style={{ background: pm.color, color: '#fff', borderRadius: 2, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}
          >
            {pm.label}
          </span>
        ))}
      </div>
    </div>
  );
}
