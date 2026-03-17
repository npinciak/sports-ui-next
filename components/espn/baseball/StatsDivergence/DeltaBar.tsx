interface DeltaBarProps {
  delta: number;
  maxDelta?: number;
}

export default function DeltaBar({ delta, maxDelta = 0.06 }: DeltaBarProps) {
  const pct = Math.min(Math.abs(delta) / maxDelta, 1) * 100;
  const isPos = delta > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
      <div style={{ width: 80, display: 'flex', justifyContent: 'flex-end' }}>
        {isPos ? null : (
          <div
            style={{
              height: 6,
              width: `${pct}%`,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ef4444, #f87171)',
              transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
            }}
          />
        )}
      </div>
      <div style={{ width: 2, height: 14, background: '#334155', flexShrink: 0 }} />
      <div style={{ width: 80, display: 'flex', justifyContent: 'flex-start' }}>
        {isPos ? (
          <div
            style={{
              height: 6,
              width: `${pct}%`,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
              transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function getDelta(actual: number, expected: number) {
  return actual - expected;
}

function getDeltaLabel(delta: number, metric: string) {
  const abs = Math.abs(delta);
  const threshold = metric === 'wOBA' ? 0.015 : metric === 'SLG' ? 0.025 : 0.015;
  if (abs < threshold * 0.5) return 'neutral';
  if (delta > 0) return 'overperforming';
  return 'underperforming';
}
