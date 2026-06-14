'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { BaseballPlayerEntity } from '@/lib/models/baseball/baseball-player.model';
import { ChevronRight } from 'lucide-react';

interface LineupEntityProps {
  player: BaseballPlayerEntity;
}

export default function LineupEntity({ player }: LineupEntityProps) {
  return (
    <Item variant="outline" key={player.id}>
      <ItemMedia>
        <Avatar className="size-12">
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
  );
}
