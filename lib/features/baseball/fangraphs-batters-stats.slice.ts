import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsBatterStatsEntity } from '@/lib/models/fangraphs/player-stats.model';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const fangraphsBatterStatsAdapter = createEntityAdapter({
  selectId: (player: FangraphsBatterStatsEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.TeamNameAbb ? FangraphsTeamToEspnTeam[player.TeamNameAbb]?.toLowerCase() : ''}` as string,
});

export const fangraphsBatterStatsSlice = createSlice({
  name: 'fangraphBatterStats',
  initialState: fangraphsBatterStatsAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsBatterStatsAdapter.setAll,
  },
});

export const {
  reducer: FangraphsBatterStatsReducer,
  name: FangraphsBatterStatsSliceName,
  actions: FangraphsBatterStatsActions,
} = fangraphsBatterStatsSlice;
