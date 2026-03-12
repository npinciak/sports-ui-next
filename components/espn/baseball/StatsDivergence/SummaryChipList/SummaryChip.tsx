interface SummaryChipProps {
  filterKey: string;
  color: string;
  label: string;
  value: string | number;
  setFilter: (key: string) => void;
  filter: string;
}

export default function SummaryChip({ filterKey, color, label, value, setFilter, filter }: SummaryChipProps) {
  return (
    <button
      key={filterKey}
      className="chip"
      onClick={() => setFilter(filterKey)}
      style={{
        background: filter === filterKey ? '#0f2744' : 'transparent',
        border: `1px solid ${filter === filterKey ? color : '#1e293b'}`,
        borderRadius: 4,
        padding: '6px 14px',
        color: filter === filterKey ? color : '#fff',
        fontFamily: 'inherit',
        fontSize: 11,
        letterSpacing: '0.1em',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 16, color: color }}>{value}</span>
      {label}
    </button>
  );
}
