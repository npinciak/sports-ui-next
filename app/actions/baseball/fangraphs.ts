'use server';

import { fetchJson } from '@/lib/helpers/http-requests';
import { FangraphsPlayerProjectionEntity } from '@/lib/models/fangraphs';
import { FangraphsPageOfResponse, IClientFangraphsStatsRequestBodyBase } from '@/lib/models/fangraphs/client.model';
import { FangraphsBatterStatsEntity, FangraphsPitcherStatsEntity } from '@/lib/models/fangraphs/player-stats.model';

export async function getFangraphsBattingProjections(): Promise<FangraphsPlayerProjectionEntity[]> {
  const params = new URLSearchParams({
    type: 'steamer',
    stats: 'bat',
    pos: 'all',
    team: '0',
    players: '0',
    lg: 'all',
    // z: Date.now().toString(),
  });

  const url = `https://www.fangraphs.com/api/projections?${params.toString()}`;

  const data = await fetchJson<FangraphsPlayerProjectionEntity[]>(url);

  return data;
}

export async function getFangraphsBattingLeaders(req: IClientFangraphsStatsRequestBodyBase): Promise<FangraphsBatterStatsEntity[]> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req)) {
    params.append(key, value as string);
  }

  const url = `https://www.fangraphs.com/api/leaders/major-league/data?${params.toString()}`;

  const { data } = await fetchJson<FangraphsPageOfResponse<FangraphsBatterStatsEntity>>(url);

  return data;
}

export async function getFangraphsPitchingProjections(): Promise<FangraphsPlayerProjectionEntity[]> {
  const params = new URLSearchParams({
    type: 'steamer',
    stats: 'pit',
    pos: 'all',
    team: '0',
    players: '0',
    lg: 'all',
    // z: Date.now().toString(),
  });

  const url = `https://www.fangraphs.com/api/projections?${params.toString()}`;

  const data = await fetchJson<FangraphsPlayerProjectionEntity[]>(url);

  return data;
}

export async function getFangraphsPitchingLeaders(req: IClientFangraphsStatsRequestBodyBase): Promise<FangraphsPitcherStatsEntity[]> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req)) {
    params.append(key, value as string);
  }

  const url = `https://www.fangraphs.com/api/leaders/major-league/data?${params.toString()}`;

  const { data } = await fetchJson<FangraphsPageOfResponse<FangraphsPitcherStatsEntity>>(url);

  return data;
}
