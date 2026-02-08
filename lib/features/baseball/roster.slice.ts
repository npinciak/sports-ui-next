import { BaseballPlayerEntity } from '@/lib/models/baseball';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const baseballTeamRosterAdapter = createEntityAdapter({
  selectId: (player: BaseballPlayerEntity) => player.sportsUiId,
  sortComparer: (a: BaseballPlayerEntity, b: BaseballPlayerEntity) => Number(a.id) - Number(b.id),
});

export const baseballTeamRosterSlice = createSlice({
  name: 'baseballTeamRoster',
  initialState: baseballTeamRosterAdapter.getInitialState(),
  reducers: {},
});

export const { reducer: BaseballTeamRosterReducer, name: BaseballTeamRosterSliceName } = baseballTeamRosterSlice;
