interface TableHeaderProps {
  activeMetric: string;
}

export default function TableHeader({ activeMetric }: TableHeaderProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 60px 90px 90px 90px 180px 80px',
        gap: 0,
        padding: '8px 16px',
        borderBottom: '1px solid #0f2744',
        marginBottom: 4,
      }}
    >
      {['PLAYER', 'POS', `ACT ${activeMetric}`, `EXP x${activeMetric}`, 'DELTA', 'DIVERGENCE', 'STATUS'].map((metric, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            color: '#fff',
            textAlign: i >= 2 ? 'right' : 'left',
            paddingRight: i === 5 ? 0 : 0,
          }}
        >
          {metric}
        </div>
      ))}
    </div>
  );
}
