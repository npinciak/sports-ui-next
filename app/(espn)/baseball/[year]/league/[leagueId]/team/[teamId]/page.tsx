import TeamHeader from '@/components/espn/baseball/TeamHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchJson } from '@/lib/helpers/http-requests';
import { BaseballTeamEntity } from '@/lib/models/baseball';
interface PageProps {
  params: Promise<{ year: string; leagueId: string; teamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { year, leagueId, teamId } = await params;

  const { data } = await fetchJson<{ metadata: { url: string }; data: BaseballTeamEntity }>(
    `http://localhost:3000/api/espn/baseball/${year}/league/${leagueId}/team/${teamId}`
  );

  return (
    <div className="space-y-4">
      <TeamHeader isLoading={false} leagueId={leagueId} team={data} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Widget A</CardTitle>
          </CardHeader>
          <CardContent>Widget A content</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Widget B</CardTitle>
          </CardHeader>
          <CardContent>Widget B content</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lineup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.roster.map(player => (
              <div key={player.id} className="rounded-lg border p-3">
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-muted-foreground">
                  {player.team} • {player.position}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
