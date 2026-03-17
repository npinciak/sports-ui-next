import { BaseballEvent } from '@/lib/models/baseball/event.model';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const baseballEventsAdapter = createEntityAdapter({
  selectId: (entity: BaseballEvent) => entity.id,
  sortComparer: (a: BaseballEvent, b: BaseballEvent) => a.timestamp - b.timestamp,
});

export const baseballEventsSlice = createSlice({
  name: 'baseballEvents',
  initialState: baseballEventsAdapter.getInitialState(),
  reducers: {
    setAll: baseballEventsAdapter.setAll,
  },
});

export const { reducer: BaseballEventsReducer, name: BaseballEventsSliceName } = baseballEventsSlice;
