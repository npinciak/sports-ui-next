import { RootState } from '@/lib/store';
import { fangraphsBatterStatsAdapter } from '../fangraphs-batters-stats.slice';

const fangraphsBatterStatsState = (state: RootState) => state.fangraphBatterStats;

const { selectById, selectIds, selectAll, selectTotal } = fangraphsBatterStatsAdapter.getSelectors(fangraphsBatterStatsState);

export const FangraphsBatterStatsSelectors = {
  selectById,
  selectIds,
  selectAll,
  selectTotal,
};
