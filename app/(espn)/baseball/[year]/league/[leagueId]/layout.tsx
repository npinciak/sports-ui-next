import { getBaseballLeague } from '@/app/actions/baseball';
import { getFangraphsBattingProjections, getFangraphsPitchingProjections } from '@/app/actions/baseball/fangraphs';
import ServerStateHydrator from '@/lib/ServerToStateHydrator';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ year: string; leagueId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { year, leagueId } = await params;

  const [data, fangraphsBatting, fangraphsPitching] = await Promise.allSettled([
    getBaseballLeague(year, leagueId),
    getFangraphsBattingProjections(),
    getFangraphsPitchingProjections(),
  ]);

  return (
    <>
      <ServerStateHydrator
        leagueInfo={data.status === 'fulfilled' ? data.value : null}
        fangraphsBattingProjections={fangraphsBatting.status === 'fulfilled' ? fangraphsBatting.value : []}
        fangraphsPitchingProjections={fangraphsPitching.status === 'fulfilled' ? fangraphsPitching.value : []}
      />

      {children}
    </>
  );
}
