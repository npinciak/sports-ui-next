'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseballLeagueSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

type RosterDropsProps = {
  count: number;
  teamList: { teamName: string; drops: number }[];
};

export function RosterDrops({ count, teamList }: RosterDropsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Roster Drops</CardTitle>
        </CardHeader>
        <CardContent>
          {count}
          <ul>
            {teamList.map((team, index) => (
              <li key={index}>
                {team.teamName}: {team.drops}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

export function RosterDropsConnected() {
  const teamsWithRosterDropsCount = useAppSelector(BaseballLeagueSelectors.getTeamDropTotals);
  const topThreeTeamsWithDrops = useAppSelector(BaseballLeagueSelectors.getTeamDropTotalsTopThree);

  return <RosterDrops count={teamsWithRosterDropsCount} teamList={topThreeTeamsWithDrops} />;
}
