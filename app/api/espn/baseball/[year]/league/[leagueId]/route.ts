import { IClientBaseballLeague } from '@/lib/espn-client-models/league.model';
import { EspnParamsBuilder } from '@/lib/helpers';
import { FantasyBaseballEndpointBuilder } from '@/lib/helpers/endpoint-builder/endpoint-builder';
import { fetchJson } from '@/lib/helpers/http-requests';
import { transformClientLeagueToBaseballLeagueV2 } from '@/lib/transformers/baseball/baseball-league-v2.transformers';
import { clientLeagueToLeagueSettings } from '@/lib/transformers/fantasy-league.transformers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ year: string; leagueId: string }> }) {
  const { year, leagueId } = await context.params;

  const getLeague = FantasyBaseballEndpointBuilder.getLeague(year, leagueId);

  const params = EspnParamsBuilder.forLeague().build();

  const url = `${getLeague}?${params.toString()}`;

  const league = await fetchJson<IClientBaseballLeague>(url);

  const leagueSettings = clientLeagueToLeagueSettings(league);

  const baseballLeague = transformClientLeagueToBaseballLeagueV2(league, leagueSettings);

  return new Response(
    JSON.stringify({
      metadata: {
        url: url,
      },
      data: baseballLeague,
    })
  );
}
