import { getBaseballTeam } from '@/app/actions/baseball/team';
import ServerStateHydrator from '@/lib/ServerToStateHydrator';
import { FangraphsDataProvider } from './FangraphsDataProvider';

interface TeamLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    year: string;
    leagueId: string;
    teamId: string;
  }>;
}

export default async function Layout({ children, params }: TeamLayoutProps) {
  const { year, leagueId, teamId } = await params;
  const data = await getBaseballTeam(year, leagueId, teamId);

  return (
    <>
      <ServerStateHydrator teamRoster={data?.roster} />
      <FangraphsDataProvider showLoading>{children}</FangraphsDataProvider>
    </>
  );
}
