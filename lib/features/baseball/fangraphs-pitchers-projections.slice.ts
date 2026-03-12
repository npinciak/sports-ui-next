import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsPlayerProjectionEntity } from '@/lib/models/fangraphs';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';

export const fangraphsPitcherProjectionAdapter = createEntityAdapter({
  selectId: (player: FangraphsPlayerProjectionEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.Team ? FangraphsTeamToEspnTeam[player.Team]?.toLowerCase() : ''}` as string,
});

export const fangraphsPitcherProjectionsSlice = createSlice({
  name: 'fangraphsPitcherProjections',
  initialState: fangraphsPitcherProjectionAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsPitcherProjectionAdapter.setAll,
  },
});

export const {
  reducer: FangraphsPitcherProjectionsReducer,
  name: FangraphsPitcherProjectionsSliceName,
  actions: FangraphsPitcherProjectionsActions,
} = fangraphsPitcherProjectionsSlice;
