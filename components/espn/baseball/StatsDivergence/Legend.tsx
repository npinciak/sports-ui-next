export default function Legend() {
  return (
    <div style={{ marginTop: 28, padding: '16px', border: '1px solid #0f2744', borderRadius: 6, background: '#040f1e' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.12em', color: '#fff', marginBottom: 10 }}>INTERPRETATION GUIDE</div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {[
          {
            color: '#22d3ee',
            label: 'Actual > Expected',
            note: 'Performance exceeds batted ball / contact quality. Regression candidate — consider selling high.',
          },
          {
            color: '#f87171',
            label: 'Actual < Expected',
            note: 'Underperforming underlying metrics. May be unlucky — potential buy-low or hold.',
          },
        ].map(item => (
          <div key={item.color} style={{ display: 'flex', gap: 10, maxWidth: 320 }}>
            <div style={{ width: 3, background: item.color, borderRadius: 2, flexShrink: 0, alignSelf: 'stretch' }} />
            <div>
              <div style={{ fontSize: 11, color: item.color, fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: '#fff', lineHeight: 1.5 }}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
