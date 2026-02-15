'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { selectTeamStartingBatterList } from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { ChevronRight } from 'lucide-react';

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
            <Item variant="outline" key={player.id}>
              <ItemMedia>
                <Avatar className="size-10">
                  <AvatarImage src={player.img} />
                  <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{player.name}</ItemTitle>
                <ItemDescription>
                  {player.team}, {player.lineupSlot}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="icon-sm" variant="outline" className="rounded-full" aria-label="Invite">
                  <ChevronRight />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
