'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectTeamStartingBatterList } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import LineupEntity from './LineupEntity';

export default function Lineup() {
  const startingLineup = useAppSelector(selectTeamStartingBatterList);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Starting Lineup</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none ">
          {startingLineup.map(player => (
            <LineupEntity key={player.id} player={player} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
