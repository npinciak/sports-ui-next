import { BaseballPlayerEntity } from '@/lib/models/baseball';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const baseballPlayersAdapter = createEntityAdapter({
  selectId: (entity: BaseballPlayerEntity) => entity.id,
});

export const baseballPlayersSlice = createSlice({
  name: 'baseballPlayers',
  initialState: baseballPlayersAdapter.getInitialState(),
  reducers: {
    setAll: baseballPlayersAdapter.setAll,
  },
});

export const { reducer: BaseballPlayersReducer, name: BaseballPlayersSliceName } = baseballPlayersSlice;
