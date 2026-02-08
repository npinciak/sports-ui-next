import { createSlice } from '@reduxjs/toolkit';

export interface FantasyLeagueBaseStateModel {
  id: string | null;
  seasonId: string | null;
  scoringPeriodId: string | null;
  firstScoringPeriod: string | null;
  finalScoringPeriod: string | null;
  matchupPeriodCount: string | null;
}

export const INITIAL_STATE: FantasyLeagueBaseStateModel = {
  id: null,
  seasonId: null,
  scoringPeriodId: null,
  firstScoringPeriod: null,
  finalScoringPeriod: null,
  matchupPeriodCount: null,
};

export const baseballLeagueSlice = createSlice({
  name: 'baseballLeague',
  initialState: INITIAL_STATE,
  reducers: {},
});

export const { reducer: BaseballLeagueReducer, name: BaseballLeagueSliceName } = baseballLeagueSlice;
