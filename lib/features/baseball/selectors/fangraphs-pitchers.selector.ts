import { RootState } from '@/lib/store';
import { fangraphsPitcherAdapter } from '../fangraphs-pitchers.slice';

const fangraphsPitcherState = (state: RootState) => state.fangraphsPitchers;

const { selectIds, selectAll } = fangraphsPitcherAdapter.getSelectors(fangraphsPitcherState);

export const FangraphsPitchersSelectors = {
  selectIds,
  selectAll,
};
