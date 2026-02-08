import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BaseballTeamEntity } from '@/lib/models/baseball';

interface TeamHeaderProps {
  isLoading: boolean;
  leagueId: string | null;
  team: BaseballTeamEntity | null;
}

export default function TeamHeader({ isLoading, leagueId, team }: TeamHeaderProps) {
  if (!team && !isLoading) return null;

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex flex-col md:flex-row xs:items-center">
          {isLoading ? (
            <Skeleton />
          ) : (
            <div style={{ width: 88, height: 88 }} className="relative rounded-md overflow-hidden bg-gray-200">
              <img src={team?.logo} alt={team?.name ?? '-'} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex flex-col mt-4 md:ml-4">
          {!isLoading && (
            <>
              <h1 className="text-xl font-bold">{team?.name}</h1>
              <p className="text-sm text-gray-600">
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
        <div className="flex flex-col mt-4 md:ml-4">
          <a
            href={`https://fantasy.espn.com/baseball/team?leagueId=${leagueId}&teamId=${team?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <Button variant="outline">View League Settings on ESPN</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
