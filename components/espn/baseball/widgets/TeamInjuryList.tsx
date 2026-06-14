'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectInjuryPlayerList } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { BaseballPlayerEntity } from '@/lib/models/baseball/baseball-player.model';
import LineupEntity from '../LineupEntity';

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
              <LineupEntity key={player.id} player={player} />
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
  const injuryPlayerList = useAppSelector(selectInjuryPlayerList);
  return <TeamInjuryList playerList={injuryPlayerList} />;
}
