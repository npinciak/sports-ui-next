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
  FangraphsBattersReducer,
  FangraphsBattersSliceName,
  FangraphsPitchersReducer,
  FangraphsPitchersSliceName,
} from './features/baseball';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [BaseballEventsSliceName]: BaseballEventsReducer,
      [BaseballLeagueSliceName]: BaseballLeagueReducer,
      [BaseballTeamRosterSliceName]: BaseballTeamRosterReducer,
      [BaseballPlayersSliceName]: BaseballPlayersReducer,
      [BaseballTransactionSliceName]: BaseballTransactionReducer,
      [FangraphsBattersSliceName]: FangraphsBattersReducer,
      [FangraphsPitchersSliceName]: FangraphsPitchersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
