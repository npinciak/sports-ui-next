'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectInjuryPlayerList } from '@/lib/features/baseball/selectors/roster.selector';
import {
  INJURY_STATUS_LIST,
  PLAYER_COMPETITION_STATUS_LABEL_BY_PLAYER_COMPETITION_STATUS,
  PlayerCompetitionStatus,
} from '@/lib/injury/injury-status.model';
import { BaseballPlayerEntity } from '@/lib/models/baseball/baseball-player.model';
import { useSelector } from 'react-redux';

function TeamInjuryPlayer({ player }: { player: BaseballPlayerEntity }) {
  const injuryStatus = player?.health?.injuryStatus as PlayerCompetitionStatus;
  const injuryStatusLabel = PLAYER_COMPETITION_STATUS_LABEL_BY_PLAYER_COMPETITION_STATUS[injuryStatus] || 'Unknown Status';

  const badgeVariant = !INJURY_STATUS_LIST.includes(injuryStatus)
    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <li key={player.id}>
      {player.name} <Badge className={badgeVariant}>{injuryStatusLabel}</Badge>
    </li>
  );
}

function TeamInjuryList({ playerList }: { playerList?: BaseballPlayerEntity[] }) {
  console.log('Injury Player List:', playerList);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disabled List</CardTitle>
      </CardHeader>
      <CardContent>
        {playerList && playerList.length > 0 ? (
          <ul>
            {playerList.map(player => (
              <TeamInjuryPlayer key={player.id} player={player} />
            ))}
          </ul>
        ) : (
          <p>No injuries reported.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function TeamInjuryListConnected() {
  const injuryPlayerList = useSelector(selectInjuryPlayerList);
  return <TeamInjuryList playerList={injuryPlayerList} />;
}
