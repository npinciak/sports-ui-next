import { getBaseballLeague } from '@/app/actions/baseball';
import { getFangraphsBattingLeaders } from '@/app/actions/baseball/fangraphs';
import ServerStateHydrator from '@/lib/ServerToStateHydrator';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ year: string; leagueId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { year, leagueId } = await params;

  const data = await getBaseballLeague(year, leagueId);
  const fangraphs = await getFangraphsBattingLeaders(year, leagueId);

  return (
    <>
      <ServerStateHydrator leagueInfo={data} />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16   sm:px-8 bg-white dark:bg-black sm:items-start">
          {children}
        </main>
      </div>
    </>
  );
}
