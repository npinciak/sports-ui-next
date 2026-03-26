import { configureStore } from '@reduxjs/toolkit';
import {
  BaseballEventsReducer,
  BaseballEventsSliceName,
  BaseballLeagueReducer,
  BaseballLeagueSliceName,
  BaseballPlayersReducer,
  BaseballPlayersSliceName,
  BaseballTeamRosterReducer,
  BaseballTeamRosterSliceName,
  BaseballTransactionReducer,
  BaseballTransactionSliceName,
  FangraphsBatterProjectionsReducer,
  FangraphsBatterProjectionsSliceName,
  FangraphsBatterStatsReducer,
  FangraphsBatterStatsSliceName,
  FangraphsPitcherProjectionsReducer,
  FangraphsPitcherProjectionsSliceName,
  FangraphsPitcherStatsReducer,
  FangraphsPitcherStatsSliceName,
  LeagueProgressionReducer,
  LeagueProgressionSliceName,
} from './features/baseball';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [BaseballEventsSliceName]: BaseballEventsReducer,
      [BaseballLeagueSliceName]: BaseballLeagueReducer,
      [BaseballTeamRosterSliceName]: BaseballTeamRosterReducer,
      [BaseballPlayersSliceName]: BaseballPlayersReducer,
      [BaseballTransactionSliceName]: BaseballTransactionReducer,
      [LeagueProgressionSliceName]: LeagueProgressionReducer,
      [FangraphsBatterStatsSliceName]: FangraphsBatterStatsReducer,
      [FangraphsBatterProjectionsSliceName]: FangraphsBatterProjectionsReducer,
      [FangraphsPitcherStatsSliceName]: FangraphsPitcherStatsReducer,
      [FangraphsPitcherProjectionsSliceName]: FangraphsPitcherProjectionsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
