import { RootState } from '@/lib/store';
import { fangraphsPitcherProjectionAdapter } from '../fangraphs-pitchers-projections.slice';

const fangraphsPitcherProjectionsState = (state: RootState) => state.fangraphsPitcherProjections;

const { selectById, selectIds, selectAll, selectTotal } = fangraphsPitcherProjectionAdapter.getSelectors(fangraphsPitcherProjectionsState);

export const FangraphsPitcherProjectionsSelectors = {
  selectById,
  selectIds,
  selectAll,
  selectTotal,
};
