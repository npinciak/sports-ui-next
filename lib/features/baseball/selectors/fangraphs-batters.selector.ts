import { RootState } from '@/lib/store';
import { fangraphsBatterAdapter } from '../fangraphs-batters.slice';

const fangraphsBatterState = (state: RootState) => state.fangraphBatters;

const { selectIds, selectAll } = fangraphsBatterAdapter.getSelectors(fangraphsBatterState);

export const FangraphsBattersSelectors = {
  selectIds,
  selectAll,
};
