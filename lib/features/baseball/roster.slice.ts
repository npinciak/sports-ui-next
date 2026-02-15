import { BaseballPlayerEntity } from '@/lib/models/baseball';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const rosterBySportsUiIdAdapter = createEntityAdapter({
  selectId: (player: BaseballPlayerEntity) => player.sportsUiId,
});

// Adapter for espnId lookups
export const rosterByEspnIdAdapter = createEntityAdapter({
  selectId: (player: BaseballPlayerEntity) => player.id,
});

interface RosterState {
  bySportsUiId: ReturnType<typeof rosterBySportsUiIdAdapter.getInitialState>;
  byEspnId: ReturnType<typeof rosterByEspnIdAdapter.getInitialState>;
}

const initialState: RosterState = {
  bySportsUiId: rosterBySportsUiIdAdapter.getInitialState(),
  byEspnId: rosterByEspnIdAdapter.getInitialState(),
};

export const baseballTeamRosterSlice = createSlice({
  name: 'baseballTeamRoster',
  initialState,
  reducers: {
    setAll: (state, action: PayloadAction<BaseballPlayerEntity[]>) => {
      // Update both indexes with the same data
      rosterBySportsUiIdAdapter.setAll(state.bySportsUiId, action.payload);
      rosterByEspnIdAdapter.setAll(state.byEspnId, action.payload);
    },
    updatePlayer: (state, action: PayloadAction<BaseballPlayerEntity>) => {
      rosterBySportsUiIdAdapter.upsertOne(state.bySportsUiId, action.payload);
      rosterByEspnIdAdapter.upsertOne(state.byEspnId, action.payload);
    },
  },
});

export const {
  reducer: BaseballTeamRosterReducer,
  name: BaseballTeamRosterSliceName,
  actions: BaseballTeamRosterActions,
} = baseballTeamRosterSlice;
