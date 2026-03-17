'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseballLeagueSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

type TradeablePlayersCountProps = {
  count: number;
};

export function TradeablePlayersCount({ count }: TradeablePlayersCountProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tradeable Players</CardTitle>
      </CardHeader>
      <CardContent>{count}</CardContent>
    </Card>
  );
}

export function TradeablePlayersCountConnected() {
  const teamsWithTradeablePlayersCount = useAppSelector(BaseballLeagueSelectors.getTeamsWithTradeablePlayersCount);
  return <TradeablePlayersCount count={teamsWithTradeablePlayersCount} />;
}
