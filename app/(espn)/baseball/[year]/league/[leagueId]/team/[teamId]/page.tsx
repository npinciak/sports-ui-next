import Lineup from '@/components/espn/baseball/Lineup';
import TeamHeader from '@/components/espn/baseball/TeamHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ year: string; leagueId: string; teamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { teamId } = await params;

  return (
    <div className="space-y-4 w-full">
      <TeamHeader isLoading={false} teamId={teamId} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Widget A</CardTitle>
          </CardHeader>
          <CardContent>
            Widget A content
            <Link href={`${teamId}/stats-divergence`} className="text-blue-500 hover:underline">
              View Stats Divergence
            </Link>
          </CardContent>
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
