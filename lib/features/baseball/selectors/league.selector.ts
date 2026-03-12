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

const getTeamDropTotalsTopThree = createSelector([selectAll], teams =>
  teams
    .map(team => ({ teamName: team.name, drops: team.transactionCounter.drops }))
    .sort((a, b) => b.drops - a.drops)
    .slice(0, 3)
);

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
  getTeamDropTotalsTopThree,
  getTeamMoveToActive,
  getTeamMoveToInjuredReserve,
};
