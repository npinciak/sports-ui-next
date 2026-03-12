import { RootState } from '@/lib/store';
import { fangraphsPitcherStatsAdapter } from '../fangraphs-pitchers-stats.slice';

const fangraphsPitcherStatsState = (state: RootState) => state.fangraphsPitcherStats;

const { selectById, selectIds, selectAll, selectTotal } = fangraphsPitcherStatsAdapter.getSelectors(fangraphsPitcherStatsState);

export const FangraphsPitcherStatsSelectors = {
  selectById,
  selectIds,
  selectAll,
  selectTotal,
};
