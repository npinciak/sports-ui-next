import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsPlayerStatEntity } from '@/lib/models/fangraphs/player-stats.model';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';

export const fangraphsPitcherAdapter = createEntityAdapter({
  selectId: (player: FangraphsPlayerStatEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.Team ? FangraphsTeamToEspnTeam[player.Team]?.toLowerCase() : ''}` as string,
});

export const fangraphsPitchersSlice = createSlice({
  name: 'fangraphsPitchers',
  initialState: fangraphsPitcherAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsPitcherAdapter.setAll,
  },
});

export const {
  reducer: FangraphsPitchersReducer,
  name: FangraphsPitchersSliceName,
  actions: FangraphsPitchersActions,
} = fangraphsPitchersSlice;
