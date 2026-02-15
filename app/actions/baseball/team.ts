'use server';

import { IClientTeamEntity } from '@/lib/espn-client-models/team.model';
import { EspnParamsBuilder } from '@/lib/helpers';
import { FantasyBaseballEndpointBuilder } from '@/lib/helpers/endpoint-builder/endpoint-builder';
import { fetchJson } from '@/lib/helpers/http-requests';
import { BaseballTeamEntity } from '@/lib/models/baseball';
import { clientTeamToBaseballTeam } from '@/lib/transformers/baseball/league.transformers';

export async function getBaseballTeam(year: string, leagueId: string, teamId: string): Promise<BaseballTeamEntity | null> {
  const getTeam = FantasyBaseballEndpointBuilder.getTeam(year, leagueId, teamId);

  const params = EspnParamsBuilder.forTeam(teamId).build();

  const url = `${getTeam}?${params.toString()}`;
  const team = await fetchJson<IClientTeamEntity>(url);

  return clientTeamToBaseballTeam(team);
}
