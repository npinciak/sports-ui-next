import { IClientBaseballLeague } from '@/lib/espn-client-models/league.model';
import { EspnParamsBuilder } from '@/lib/helpers';
import { FantasyBaseballEndpointBuilder } from '@/lib/helpers/endpoint-builder/endpoint-builder';
import { clientLeagueToLeagueSettings } from '@/lib/transformers/fantasy-league.transformers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { year: string; leagueId: string } }) {
  const { year, leagueId } = await context.params;

  const getLeague = FantasyBaseballEndpointBuilder.getLeague(year, leagueId);

  const params = EspnParamsBuilder.forLeague().build();

  const url = `${getLeague}?${params.toString()}`;

  const val = await fetch(url)
    .then(res => res.json() as Promise<IClientBaseballLeague>)
    .catch(err => {
      console.error(err);
      return null;
    });

  return new Response(
    JSON.stringify({
      metadata: {
        url: url,
      },
      data: clientLeagueToLeagueSettings(val),
    })
  );
}
