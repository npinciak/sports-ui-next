'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseballLeagueSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

type RosterDropsProps = {
  count: number;
};

export function RosterDrops({ count }: RosterDropsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roster Drops</CardTitle>
      </CardHeader>
      <CardContent>{count}</CardContent>
    </Card>
  );
}

export function RosterDropsConnected() {
  const teamsWithRosterDropsCount = useAppSelector(BaseballLeagueSelectors.getTeamDropTotals);
  return <RosterDrops count={teamsWithRosterDropsCount} />;
}
