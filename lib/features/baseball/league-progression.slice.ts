import { LeagueProgression } from '@/lib/models';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const leagueProgressionAdapter = createEntityAdapter({
  selectId: (entity: LeagueProgression) => entity.id!,
});

export const leagueProgressionSlice = createSlice({
  name: 'leagueProgression',
  initialState: leagueProgressionAdapter.getInitialState(),
  reducers: {
    setAll: leagueProgressionAdapter.setAll,
  },
});

export const {
  reducer: LeagueProgressionReducer,
  name: LeagueProgressionSliceName,
  actions: LeagueProgressionActions,
} = leagueProgressionSlice;
