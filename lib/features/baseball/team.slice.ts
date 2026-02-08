import { createSlice } from '@reduxjs/toolkit';

export interface BaseballTeamBaseStateModel {}

export const INITIAL_STATE: BaseballTeamBaseStateModel = {};

export const baseballTeamSlice = createSlice({
  name: 'baseballTeam',
  initialState: INITIAL_STATE,
  reducers: {},
});

export const { reducer: BaseballTeamReducer, name: BaseballTeamSliceName } = baseballTeamSlice;
