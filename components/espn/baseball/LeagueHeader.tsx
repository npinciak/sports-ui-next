'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BaseballImageHelper } from '@/lib/helpers';
import { BaseballLeague } from '@/lib/models/baseball';

interface LeagueHeaderProps {
  isLoading: boolean;
  league: BaseballLeague | null;
}

export default function LeagueHeader({ isLoading, league }: LeagueHeaderProps) {
  if (!league && !isLoading) return null;

  const leagueName = league?.name || null;

  const year = league?.seasonId ? `${league.seasonId} Season` : null;

  const leagueType = league?.scoringType || null;

  const teamCount = league?.size ? `${league.size} Teams` : null;

  const scoringPeriodId = league?.scoringPeriodId ? `Day ${league.scoringPeriodId}` : 'Preseason';

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-md md:h-22 md:w-22" />
          ) : (
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 md:h-22 md:w-22">
              <img src={BaseballImageHelper.fantasySportLeagueImage} alt={leagueName ?? '-'} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-1">
            {!isLoading && (
              <>
                <h1 className="text-lg font-bold md:text-xl">{leagueName}</h1>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {[year ?? '-', leagueType ?? '-', teamCount ?? '-', scoringPeriodId ?? '-'].filter(Boolean).join(' | ')}
                </p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <a
              href={`https://fantasy.espn.com/baseball/league?leagueId=${league?.id}`}
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
