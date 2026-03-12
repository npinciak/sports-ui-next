import { PitcherWithRegressionMetrics } from '../model';
import ListRow from './ListRow';

interface ListViewProps {
  playerList: PitcherWithRegressionMetrics[];
  onPlayerClick: (playerName: string) => void;
}

export default function ListView({ playerList, onPlayerClick }: ListViewProps) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8e0d0', borderRadius: 8, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 50px 55px 55px 55px 60px 70px 100px',
          padding: '10px 16px',
          borderBottom: '2px solid #1a1208',
          gap: 8,
        }}
      >
        {['PITCHER', 'G', 'WAR', 'K%', 'BB%', 'SwStr%', 'BEST', 'ARSENAL'].map((h, i) => (
          <div key={i} style={{ fontSize: 10, letterSpacing: '0.1em', color: '#8a7a5a', textAlign: i >= 2 ? 'right' : 'left' }}>
            {h}
          </div>
        ))}
      </div>
      {[...playerList]
        .sort((a, b) => (b.fangraphsStats?.WAR ?? 0) - (a.fangraphsStats?.WAR ?? 0))
        .map((p, i) => {
          const playerName = p.name;

          return <ListRow listIndex={i} key={i} player={p} onClick={() => onPlayerClick(playerName)} />;
        })}
    </div>
  );
}
