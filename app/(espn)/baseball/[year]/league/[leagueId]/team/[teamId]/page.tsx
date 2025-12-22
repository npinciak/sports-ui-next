import TeamHeader from "@/components/espn/baseball/TeamHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/helpers/http-requests";
import { BaseballTeamEntity } from "@/lib/models/baseball";
interface PageProps {
  params: Promise<{ year: string; leagueId: string, teamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { year, leagueId, teamId } = await params;

  const { data } = await fetchJson<{ metadata: { url: string }, data: BaseballTeamEntity }>(`http://localhost:3000/api/espn/baseball/${year}/league/${leagueId}/team/${teamId}`)

  return (
    <>
      <div className="w-full">
        <TeamHeader isLoading={false} leagueId={leagueId} team={data} />
      </div>
      <div className="w-full mt-4 flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Widget A</CardTitle>
          </CardHeader>
          <CardContent>
            Widget A content
          </CardContent>
        </Card>
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Widget B</CardTitle>
          </CardHeader>
          <CardContent>
            Widget B content
          </CardContent>
        </Card>
      </div>
      <div className="w-full mt-4 flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Lineup</CardTitle>
          </CardHeader>
          <CardContent>
            {data.roster.map(player => (
              <div key={player.id} className="mb-2">
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-600">{player.team}, {player.position}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
