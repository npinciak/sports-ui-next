'use server';

import { fetchJson } from '@/lib/helpers/http-requests';

export async function getFangraphsBattingLeaders(year: string, leagueId: string): Promise<unknown> {
  //   const getLeague = FantasyBaseballEndpointBuilder.getLeague(year, leagueId);

  //   const params = EspnParamsBuilder.forLeague().build();

  //   const url = `${getLeague}?${params.toString()}`;

  const { data } = await fetchJson<{ data: unknown }>(
    'https://www.fangraphs.com/api/leaders/major-league/data?age=&pos=all&stats=bat&lg=all&qual=0&season=2025&season1=2025&startdate=2025-03-01&enddate=2025-11-01&month=0&hand=&team=0%2Cts&pageitems=30&pagenum=1&ind=0&rost=0&players=0&type=8&postseason=&sortdir=default&sortstat=WAR'
  );

  console.log('Fangraphs Batting Leaders:', data);

  return data;
}
