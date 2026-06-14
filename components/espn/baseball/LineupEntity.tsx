'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  INJURY_STATUS_LIST,
  PLAYER_COMPETITION_STATUS_LABEL_BY_PLAYER_COMPETITION_STATUS,
  PlayerCompetitionStatus,
} from '@/lib/injury/injury-status.model';
import { BaseballPlayerEntity } from '@/lib/models/baseball/baseball-player.model';
import { ChevronRight } from 'lucide-react';

interface LineupEntityProps {
  player: BaseballPlayerEntity;
}

export default function LineupEntity({ player }: LineupEntityProps) {
  const injuryStatus = player?.health?.injuryStatus as PlayerCompetitionStatus;
  const injuryStatusLabel = PLAYER_COMPETITION_STATUS_LABEL_BY_PLAYER_COMPETITION_STATUS[injuryStatus] || 'Unknown Status';

  const badgeVariant = !INJURY_STATUS_LIST.includes(injuryStatus)
    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';

  const showInjuryBadge = INJURY_STATUS_LIST.includes(injuryStatus);

  return (
    <Item variant="outline" key={player.id}>
      <ItemMedia>
        <Avatar className="size-12">
          <AvatarImage src={player.img} />
          <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {player.name}
          {showInjuryBadge && (
            <span className="ml-2">
              <Badge className={badgeVariant}>{injuryStatusLabel}</Badge>
            </span>
          )}
        </ItemTitle>
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
