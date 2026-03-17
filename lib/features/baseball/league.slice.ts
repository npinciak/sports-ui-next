import { BaseballTeamNoRosterEntity } from '@/lib/models/baseball/baseball-team.model';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const baseballTeamAdapter = createEntityAdapter({
  selectId: (team: BaseballTeamNoRosterEntity) => team.id,
  sortComparer: (a: BaseballTeamNoRosterEntity, b: BaseballTeamNoRosterEntity) => Number(a.id) - Number(b.id),
});

export interface FantasyLeagueBaseStateModel {
  id: string | null;
  seasonId: string | null;
  scoringPeriodId: string | null;
  firstScoringPeriod: string | null;
  finalScoringPeriod: string | null;
  teams: ReturnType<typeof baseballTeamAdapter.getInitialState>;
  matchupPeriodCount: string | null;
}

export const INITIAL_STATE: FantasyLeagueBaseStateModel = {
  id: null,
  seasonId: null,
  scoringPeriodId: null,
  firstScoringPeriod: null,
  finalScoringPeriod: null,
  matchupPeriodCount: null,
  teams: baseballTeamAdapter.getInitialState(),
};

export const baseballLeagueSlice = createSlice({
  name: 'baseballLeague',
  initialState: INITIAL_STATE,
  reducers: {
    setLeagueInfo: (state, action: PayloadAction<Omit<FantasyLeagueBaseStateModel, 'teams'>>) => {
      const { id, seasonId, scoringPeriodId, firstScoringPeriod, finalScoringPeriod, matchupPeriodCount } = action.payload;
      state.id = id;
      state.seasonId = seasonId;
      state.scoringPeriodId = scoringPeriodId;
      state.firstScoringPeriod = firstScoringPeriod;
      state.finalScoringPeriod = finalScoringPeriod;
      state.matchupPeriodCount = matchupPeriodCount;
    },
    setTeams: (state, action: PayloadAction<BaseballTeamNoRosterEntity[]>) => {
      baseballTeamAdapter.setAll(state.teams, action.payload);
    },
    upsertTeam: (state, action: PayloadAction<BaseballTeamNoRosterEntity>) => {
      baseballTeamAdapter.upsertOne(state.teams, action.payload);
    },
  },
});

export const { reducer: BaseballLeagueReducer, name: BaseballLeagueSliceName, actions: BaseballLeagueActions } = baseballLeagueSlice;
