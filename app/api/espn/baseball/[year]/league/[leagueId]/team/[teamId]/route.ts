import { IClientBaseballLeague } from '@/lib/espn-client-models/league.model';
import { EspnParamsBuilder } from '@/lib/helpers';
import { FantasyBaseballEndpointBuilder } from '@/lib/helpers/endpoint-builder/endpoint-builder';
import { clientTeamToBaseballTeam } from '@/lib/transformers/baseball/baseball-league-v2.transformers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { year: string; leagueId: string; teamId: string } }) {
  const { year, leagueId, teamId } = await context.params;

  const getLeague = FantasyBaseballEndpointBuilder.getLeague(year, leagueId);

  const params = EspnParamsBuilder.forTeam(teamId).build();

  const url = `${getLeague}?${params.toString()}`;

  const val = await fetch(url)
    .then(res => res.json() as Promise<IClientBaseballLeague>)
    .catch(err => {
      console.error(err);
      return null;
    });

  const team = val ? val.teams.find(t => t.id.toString() === teamId) : null;

  return new Response(
    JSON.stringify({
      metadata: {
        url: url,
      },
      data: team ? clientTeamToBaseballTeam(team) : null,
    })
  );
}
