import SummaryChip from './SummaryChip';

interface SummaryChipListProps {
  playerAmount: number;
  overPerformingAmount: number;
  underPerformingAmount: number;
  filter: string;
  setFilter: (key: string) => void;
}

export default function SummaryChipList({
  playerAmount,
  overPerformingAmount,
  underPerformingAmount,
  filter,
  setFilter,
}: SummaryChipListProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
      {[
        { label: 'ALL PLAYERS', value: playerAmount, key: 'all', color: '#94a3b8' },
        { label: 'OVERPERFORMING', value: overPerformingAmount, key: 'overperforming', color: '#22d3ee' },
        { label: 'UNDERPERFORMING', value: underPerformingAmount, key: 'underperforming', color: '#f87171' },
      ].map(chip => (
        <SummaryChip
          key={chip.key}
          filterKey={chip.key}
          label={chip.label}
          value={chip.value}
          color={chip.color}
          setFilter={setFilter}
          filter={filter}
        />
      ))}
    </div>
  );
}
