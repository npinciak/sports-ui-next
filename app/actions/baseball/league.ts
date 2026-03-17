'use server';

import { IClientBaseballLeague } from '@/lib/espn-client-models/league.model';
import { EspnParamsBuilder } from '@/lib/helpers';
import { FantasyBaseballEndpointBuilder } from '@/lib/helpers/endpoint-builder/endpoint-builder';
import { fetchJson } from '@/lib/helpers/http-requests';
import { BaseballLeague } from '@/lib/models/baseball/baseball-league.model';
import { transformClientLeagueToBaseballLeagueV2 } from '@/lib/transformers/baseball/league.transformers';
import { clientLeagueToLeagueSettings } from '@/lib/transformers/fantasy-league.transformers';

export async function getBaseballLeague(year: string, leagueId: string): Promise<BaseballLeague> {
  const getLeague = FantasyBaseballEndpointBuilder.getLeague(year, leagueId);

  const params = EspnParamsBuilder.forLeague().build();

  const url = `${getLeague}?${params.toString()}`;

  const league = await fetchJson<IClientBaseballLeague>(url);

  const leagueSettings = clientLeagueToLeagueSettings(league);

  const baseballLeague = transformClientLeagueToBaseballLeagueV2(league, leagueSettings);

  return baseballLeague;
}
