'use server';

import { fetchJson } from '@/lib/helpers/http-requests';
import { FangraphsPlayerStatEntity } from '@/lib/models/fangraphs';
import { FangraphsPageOfResponse } from '@/lib/models/fangraphs/client.model';

export async function getFangraphsBattingLeaders(year: string): Promise<FangraphsPlayerStatEntity[]> {
  const params = new URLSearchParams({
    age: '',
    pos: 'all',
    stats: 'bat',
    lg: 'all',
    qual: '0',
    season: year,
    season1: year,
    startdate: `${year}-03-01`,
    enddate: `${year}-11-01`,
    month: '0',
    hand: '',
    team: '0,ts',
    pageitems: '30',
    pagenum: '1',
    ind: '0',
    rost: '0',
    players: '0',
    type: '8',
    postseason: '',
    sortdir: 'default',
    sortstat: 'WAR',
  });

  const url = `https://www.fangraphs.com/api/leaders/major-league/data?${params.toString()}`;

  const { data } = await fetchJson<FangraphsPageOfResponse<FangraphsPlayerStatEntity>>(url);

  return data;
}

export async function getFangraphsPitchingLeaders(year: string): Promise<FangraphsPlayerStatEntity[]> {
  const params = new URLSearchParams({
    age: '',
    pos: 'all',
    stats: 'pit',
    lg: 'all',
    qual: '0',
    season: year,
    season1: year,
    startdate: `${year}-03-01`,
    enddate: `${year}-11-01`,
    month: '0',
    hand: '',
    team: '0,ts',
    pageitems: '30',
    pagenum: '1',
    ind: '0',
    rost: '0',
    players: '0',
    type: '8',
    postseason: '',
    sortdir: 'default',
    sortstat: 'WAR',
  });

  const url = `https://www.fangraphs.com/api/leaders/major-league/data?${params.toString()}`;

  const { data } = await fetchJson<FangraphsPageOfResponse<FangraphsPlayerStatEntity>>(url);

  return data;
}
