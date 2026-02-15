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
} from './features/baseball';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [BaseballEventsSliceName]: BaseballEventsReducer,
      [BaseballLeagueSliceName]: BaseballLeagueReducer,
      [BaseballTeamRosterSliceName]: BaseballTeamRosterReducer,
      [BaseballPlayersSliceName]: BaseballPlayersReducer,
      [BaseballTransactionSliceName]: BaseballTransactionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
