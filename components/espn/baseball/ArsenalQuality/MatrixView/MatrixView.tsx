import { useState } from 'react';
import { PitcherWithRegressionMetrics } from '../model';
import Details from './Details';
import ScatterChart from './ScatterChart';

interface MatrixViewProps {
  playerList: PitcherWithRegressionMetrics[];
}

export default function MatrixView({ playerList }: MatrixViewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const name = selected || hovered;
  const focusP = name ? playerList.find(p => p.name === name) : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 16 }}>
      {/* Scatter */}
      <ScatterChart playerList={playerList} selected={selected} hovered={hovered} setSelected={setSelected} setHovered={setHovered} />

      {/* Detail Panel */}
      <Details player={focusP} />
    </div>
  );
}
