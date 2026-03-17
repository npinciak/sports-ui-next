import { BaseballTransactionEntity } from '@/lib/models/baseball';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const baseballTransactionAdapter = createEntityAdapter({
  selectId: (team: BaseballTransactionEntity) => team.id,
  sortComparer: (a: BaseballTransactionEntity, b: BaseballTransactionEntity) =>
    b.transactionProposedDateTimestamp! - a.transactionProposedDateTimestamp!,
});

export const baseballTransactionSlice = createSlice({
  name: 'baseballTransaction',
  initialState: baseballTransactionAdapter.getInitialState(),
  reducers: {},
});

export const { reducer: BaseballTransactionReducer, name: BaseballTransactionSliceName } = baseballTransactionSlice;
