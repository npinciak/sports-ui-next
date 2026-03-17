interface QuadrantLegendProps {
  quadrantList: any[];
}

export default function QuadrantLegend({ quadrantList }: QuadrantLegendProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
      {quadrantList.map(q => (
        <div
          key={q.id}
          style={{
            background: '#111111',
            border: `1px solid ${q.color}33`,
            borderLeft: `3px solid ${q.color}`,
            borderRadius: 6,
            padding: '10px 12px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: q.color, letterSpacing: '0.08em' }}>{q.label}</div>
          <div style={{ fontSize: 10, color: '#4b5563', marginTop: 3, lineHeight: 1.4 }}>{q.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
