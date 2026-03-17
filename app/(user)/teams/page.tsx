import { Card, CardContent } from '@/components/ui/card';
import { getTeamsByUserId } from '@/lib/supabase/queries/teams';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const teams = await getTeamsByUserId('ea2f65a1-0e67-4820-83a4-355573048203');

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Teams</h1>
        <Link href="/leagues" className="text-sm text-muted-foreground underline underline-offset-4">
          View Leagues
        </Link>
      </div>
      {teams.length === 0 ? (
        <p className="text-muted-foreground">No teams found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {teams.map(team => (
            <li key={team.id}>
              <Link href={`/${team.sport}/${team.year}/league/${team.espnLeagueId}/team/${team.espnLeagueTeamId}`}>
                <Card className="hover:bg-accent active:scale-95 transition-all cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{team.teamName ?? `Team ${team.espnLeagueTeamId}`}</p>
                      <p className="text-sm text-muted-foreground">Sport: {team.sport}</p>
                      <p className="text-sm text-muted-foreground">Year: {team.year}</p>
                      <p className="text-sm text-muted-foreground">League ID: {team.espnLeagueId}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
