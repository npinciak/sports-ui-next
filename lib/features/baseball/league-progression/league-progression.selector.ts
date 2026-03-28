import { RootState } from '@/lib/store';
import { leagueProgressionAdapter } from './league-progression.slice';

const leagueProgressionState = (state: RootState) => state.leagueProgression;

const { selectById, selectIds, selectAll, selectTotal } = leagueProgressionAdapter.getSelectors(leagueProgressionState);

export const LeagueProgressionSelectors = {
  selectById,
  selectIds,
  selectAll,
  selectTotal,
};
