import { getBaseballLeague } from '@/app/actions/baseball/league';
import LeagueHeader from '@/components/espn/baseball/LeagueHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ year: string; leagueId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { year, leagueId } = await params;

  const data = await getBaseballLeague(year, leagueId);

  return (
    <div className="space-y-4">
      <LeagueHeader isLoading={false} league={data} />
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.teams.map(team => (
              <Link
                key={team.id}
                href={`/baseball/${year}/league/${leagueId}/team/${team.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">{team.name}</span>
                <span className="text-sm text-muted-foreground">{team.totalPoints ?? '-'}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Widget A</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Widget B</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
