import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsPlayerProjectionEntity } from '@/lib/models/fangraphs';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';

export const fangraphsBatterProjectionAdapter = createEntityAdapter({
  selectId: (player: FangraphsPlayerProjectionEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.Team ? FangraphsTeamToEspnTeam[player.Team]?.toLowerCase() : ''}` as string,
});

export const fangraphsBatterProjectionsSlice = createSlice({
  name: 'fangraphBatterProjections',
  initialState: fangraphsBatterProjectionAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsBatterProjectionAdapter.setAll,
  },
});

export const {
  reducer: FangraphsBatterProjectionsReducer,
  name: FangraphsBatterProjectionsSliceName,
  actions: FangraphsBatterProjectionsActions,
} = fangraphsBatterProjectionsSlice;
