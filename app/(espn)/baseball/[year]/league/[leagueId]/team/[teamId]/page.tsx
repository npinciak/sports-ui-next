import { getBaseballTeam } from '@/app/actions/baseball/team';
import Lineup from '@/components/espn/baseball/Lineup';
import TeamHeader from '@/components/espn/baseball/TeamHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServerStateHydrator from '@/lib/ServerToStateHydrator';

interface PageProps {
  params: Promise<{ year: string; leagueId: string; teamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { year, leagueId, teamId } = await params;

  const data = await getBaseballTeam(year, leagueId, teamId);

  return (
    <div className="space-y-4 w-full">
      <ServerStateHydrator teamRoster={data?.roster} />

      <TeamHeader isLoading={false} teamId={teamId} />
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
      <Lineup />
    </div>
  );
}
