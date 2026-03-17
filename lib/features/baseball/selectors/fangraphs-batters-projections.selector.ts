import { RootState } from '@/lib/store';
import { fangraphsBatterProjectionAdapter } from '../fangraphs-batters-projections.slice';

const fangraphsBatterProjectionsState = (state: RootState) => state.fangraphBatterProjections;

const { selectById, selectIds, selectAll, selectTotal } = fangraphsBatterProjectionAdapter.getSelectors(fangraphsBatterProjectionsState);

export const FangraphsBatterProjectionsSelectors = {
  selectById,
  selectIds,
  selectAll,
  selectTotal,
};
