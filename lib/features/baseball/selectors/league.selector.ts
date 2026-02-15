import { RootState } from '@/lib/store';
import { createSelector } from '@reduxjs/toolkit';
import { baseballTeamAdapter } from '../league.slice';

const baseballLeagueState = (state: RootState) => state.baseballLeague;
const getTeams = createSelector([baseballLeagueState], league => league.teams);

const { selectById, selectAll } = baseballTeamAdapter.getSelectors<RootState>(getTeams);

const getById = (state: RootState, id: string | null | undefined) => {
  if (!id) return null;
  return selectById(state, id);
};

const getTeamsWithTradeablePlayers = createSelector([selectAll], teams =>
  teams.filter(team => team.hasTradeablePlayers).map(({ name, id }) => ({ name, id }))
);

const getTeamsWithTradeablePlayersCount = createSelector([getTeamsWithTradeablePlayers], teams => teams.length);

const getTeamDropTotals = createSelector([selectAll], teams => teams.reduce((acc, team) => acc + team.transactionCounter.drops, 0));

const getTeamMoveToActive = createSelector([selectAll], teams =>
  teams.reduce((acc, team) => acc + team.transactionCounter.moveToActive, 0)
);
const getTeamMoveToInjuredReserve = createSelector([selectAll], teams =>
  teams.reduce((acc, team) => acc + team.transactionCounter.moveToIR, 0)
);

export const BaseballLeagueSelectors = {
  getById,
  getTeamsWithTradeablePlayers,
  getTeamsWithTradeablePlayersCount,
  getTeamDropTotals,
  getTeamMoveToActive,
  getTeamMoveToInjuredReserve,
};
