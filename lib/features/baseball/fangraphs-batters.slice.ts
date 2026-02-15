import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsPlayerStatEntity } from '@/lib/models/fangraphs/player-stats.model';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';

export const fangraphsBatterAdapter = createEntityAdapter({
  selectId: (player: FangraphsPlayerStatEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.Team ? FangraphsTeamToEspnTeam[player.Team]?.toLowerCase() : ''}` as string,
});

export const fangraphsBattersSlice = createSlice({
  name: 'fangraphBatters',
  initialState: fangraphsBatterAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsBatterAdapter.setAll,
  },
});

export const {
  reducer: FangraphsBattersReducer,
  name: FangraphsBattersSliceName,
  actions: FangraphsBattersActions,
} = fangraphsBattersSlice;
