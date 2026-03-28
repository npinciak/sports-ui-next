import { LeagueProgression } from '@/lib/models';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { LeagueProgressionClient } from './league-progresson.client';

export const leagueProgressionAdapter = createEntityAdapter({
  selectId: (entity: LeagueProgression) => entity.id!,
});

export const leagueProgressionSlice = createSlice({
  name: 'leagueProgression',
  initialState: leagueProgressionAdapter.getInitialState(),
  reducers: {
    setAll: leagueProgressionAdapter.setAll,
  },
  extraReducers: builder => {
    builder.addMatcher(LeagueProgressionClient.endpoints.getLeagueProgression.matchFulfilled, (state, action) => {
      leagueProgressionAdapter.setAll(state, action.payload.data);
    });
  },
});

export const {
  reducer: LeagueProgressionReducer,
  name: LeagueProgressionSliceName,
  actions: LeagueProgressionActions,
} = leagueProgressionSlice;
