import LeagueHeader from "@/components/espn/baseball/LeagueHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchJson } from "@/lib/helpers/http-requests";
import { BaseballLeague } from "@/lib/models/baseball";
import Link from "next/link";

interface PageProps {
  params: Promise<{ year: string; leagueId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { year, leagueId } = await params;

  const { data } = await fetchJson<{ metadata: { url: string }, data: BaseballLeague }>(`http://localhost:3000/api/espn/baseball/${year}/league/${leagueId}`)

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
                    <Link href={`/baseball/${year}/league/${leagueId}/team/${team.id}`} className="text-blue-600 hover:underline hover:cursor-pointer">
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>


      </div>
      <div className="w-full mt-4  xs:flex-col flex flex-row gap-4">
        <Card className="w-25 xs:w-full">
          <CardHeader>
            <CardTitle>s</CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        <Card className="w-25 xs:w-full">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        <Card className="w-25 xs:w-full" >
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        <Card className="w-25 xs:w-full">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div >
    </>);
}
