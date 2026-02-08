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
    <>
      <div className="w-full">
        <LeagueHeader isLoading={false} league={data} />
        <Card>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Teams</h2>
              <ul className="list-disc list-inside">
                {data.teams.map(team => (
                  <li key={team.id}>
                    <Link
                      href={`/baseball/${year}/league/${leagueId}/team/${team.id}`}
                      className="text-blue-600 hover:underline hover:cursor-pointer"
                    >
                      {team.name}
                    </Link>
                    {team.totalPoints ?? '-'}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full mt-4 flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Widget A</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Widget B</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </>
  );
}
