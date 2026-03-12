import { Card, CardContent } from '@/components/ui/card';
import { getLeaguesByUserId } from '@/lib/supabase/queries/leagues';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const leagues = await getLeaguesByUserId('ea2f65a1-0e67-4820-83a4-355573048203');

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Leagues</h1>
        <Link href="/teams" className="text-sm text-muted-foreground underline underline-offset-4">
          View Teams
        </Link>
      </div>
      {leagues.length === 0 ? (
        <p className="text-muted-foreground">No leagues found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {leagues.map(league => (
            <li key={league.id}>
              <Link href={`/${league.sport}/${league.year}/league/${league.espnLeagueId}`}>
                <Card className="hover:bg-accent active:scale-95 transition-all cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{league.leagueName ?? `League ${league.espnLeagueId}`}</p>
                      <p className="text-sm text-muted-foreground">Sport: {league.sport}</p>
                      <p className="text-sm text-muted-foreground">Year: {league.year}</p>
                      <p className="text-sm text-muted-foreground">League ID: {league.espnLeagueId}</p>
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
