'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BaseballLeagueSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

interface TeamHeaderProps {
  isLoading: boolean;
  teamId: string | null;
}

export default function TeamHeader({ isLoading, teamId }: TeamHeaderProps) {
  if (!teamId) return null;

  const team = useAppSelector(state => BaseballLeagueSelectors.getById(state, teamId));

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-md md:h-22 md:w-22" />
          ) : (
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 md:h-22 md:w-22">
              <img src={team?.logo} alt={team?.name ?? '-'} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-1">
            {!isLoading && (
              <>
                <h1 className="text-lg font-bold md:text-xl">{team?.name}</h1>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {[
                    team?.currentRank ? `Current Rank: ${team?.currentRank}` : '-',
                    team?.totalPoints ? `Total Points: ${team?.totalPoints}` : '-',
                  ]
                    .filter(Boolean)
                    .join(' | ')}
                </p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <a
              // href={`https://fantasy.espn.com/baseball/team?leagueId=${team}&teamId=${team?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                View on ESPN
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
