import { normalizeName } from '@/lib/helpers/normalize-name';
import { FangraphsPitcherStatsEntity } from '@/lib/models/fangraphs/player-stats.model';
import { FangraphsTeamToEspnTeam } from '@/lib/models/fangraphs/team.model';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const fangraphsPitcherStatsAdapter = createEntityAdapter({
  selectId: (player: FangraphsPitcherStatsEntity) =>
    `name=${normalizeName(player?.PlayerName)}~team=${player.TeamNameAbb ? FangraphsTeamToEspnTeam[player.TeamNameAbb]?.toLowerCase() : ''}` as string,
});

export const fangraphsPitcherStatsSlice = createSlice({
  name: 'fangraphsPitcherStats',
  initialState: fangraphsPitcherStatsAdapter.getInitialState(),
  reducers: {
    setAll: fangraphsPitcherStatsAdapter.setAll,
  },
});

export const {
  reducer: FangraphsPitcherStatsReducer,
  name: FangraphsPitcherStatsSliceName,
  actions: FangraphsPitcherStatsActions,
} = fangraphsPitcherStatsSlice;
