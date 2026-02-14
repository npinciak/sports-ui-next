import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  reducers: {
    setLeagueInfo: (state, action: PayloadAction<FantasyLeagueBaseStateModel>) => {
      const { id, seasonId, scoringPeriodId, firstScoringPeriod, finalScoringPeriod, matchupPeriodCount } = action.payload;
      state.id = id;
      state.seasonId = seasonId;
      state.scoringPeriodId = scoringPeriodId;
      state.firstScoringPeriod = firstScoringPeriod;
      state.finalScoringPeriod = finalScoringPeriod;
      state.matchupPeriodCount = matchupPeriodCount;
    },
  },
});

export const { reducer: BaseballLeagueReducer, name: BaseballLeagueSliceName, actions: BaseballLeagueActions } = baseballLeagueSlice;
