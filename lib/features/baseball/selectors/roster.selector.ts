import { BASEBALL_LINEUP_MAP, ClientBaseballLineupSlot } from '@/lib/espn-client-models/baseball';
import { existsFilter } from '@/lib/helpers';
import { benchPlayersFilter, startingPlayersFilter, transformFangraphIds } from '@/lib/helpers/baseball';
import { RootState } from '@/lib/store';
import { createSelector } from '@reduxjs/toolkit';
import { rosterByEspnIdAdapter, rosterBySportsUiIdAdapter } from '../roster.slice';
import { FangraphsBatterProjectionsSelectors } from './fangraphs-batters-projections.selector';
import { FangraphsBatterStatsSelectors } from './fangraphs-batters-stats.selector';
import { FangraphsPitcherProjectionsSelectors } from './fangraphs-pitcher-projections.selector';
import { FangraphsPitcherStatsSelectors } from './fangraphs-pitcher-stats.selector';

const rosterState = (state: RootState) => state.baseballTeamRoster;

const rosterBySportsUiIdSelectors = rosterBySportsUiIdAdapter.getSelectors((state: RootState) => state.baseballTeamRoster.bySportsUiId);

const rosterByEspnIdSelectors = rosterByEspnIdAdapter.getSelectors((state: RootState) => state.baseballTeamRoster.byEspnId);

const { selectById: selectBySportsUiId, selectIds: selectIdsBySportsUiId, selectAll: selectAllBySportsUiId } = rosterBySportsUiIdSelectors;

const { selectById: selectByEspnId, selectIds: selectIdsByEspnId, selectAll: selectAllByEspnId } = rosterByEspnIdSelectors;

export const selectInjuryPlayerList = createSelector([selectAllBySportsUiId], players =>
  players.filter(p => {
    if (!p.health) return false;

    const isOnInjuryList = p.lineupSlotId === ClientBaseballLineupSlot.IL;
    if (isOnInjuryList) return true;

    return p.health?.isInjured;
  })
);

export const selectTeamBatterList = createSelector([selectAllBySportsUiId], players =>
  players.filter(p => !p.isPitcher || p.lineupSlotId === ClientBaseballLineupSlot.DH)
);

export const selectTeamStartingBatterList = createSelector([selectTeamBatterList], players =>
  startingPlayersFilter(players, BASEBALL_LINEUP_MAP)
);

export const selectTeamBenchBatterList = createSelector([selectTeamBatterList], players =>
  benchPlayersFilter(players, BASEBALL_LINEUP_MAP)
);

// export const selectTeamStartingBatterListWithEvents = createSelector([selectTeamStartingBatterList], players =>
//   players.map(player => addEventsToBatterEntity(player))
// );

// export const selectTeamBenchBatterListWithEvents = createSelector([selectTeamBenchBatterList], players =>
//   players.map(player => addEventsToBatterEntity(player))
// );

// export const selectStartingTeamBenchBatters = createSelector([selectTeamBenchBatterListWithEvents], benchPlayers =>
//   benchPlayers.filter(player => player.isInStartingLineup)
// );

// export const selectStartingBattersNotInLineup = createSelector([selectTeamStartingBatterListWithEvents], players =>
//   players.filter(player => player.isNotInStartingLineup)
// );

export const selectTeamPitcherList = createSelector([selectAllBySportsUiId], players =>
  players.filter(p => p.isPitcher && p.lineupSlotId !== ClientBaseballLineupSlot.UTIL)
);

export const selectTeamStartingPitcherList = createSelector([selectTeamPitcherList], players =>
  startingPlayersFilter(players, BASEBALL_LINEUP_MAP)
);

export const selectTeamBenchPitcherList = createSelector([selectTeamPitcherList], players =>
  benchPlayersFilter(players, BASEBALL_LINEUP_MAP)
);

// export const selectTeamStartingPitcherListWithEvents = createSelector(
//   [selectTeamStartingPitcherList, selectEventIdSet],
//   (players, eventIdSet) => players.map(player => addEventsToPitcherEntity(player, eventIdSet))
// );

// export const selectTeamBenchPitcherListWithEvents = createSelector([selectTeamBenchPitcherList, selectEventIdSet], (players, eventIdSet) =>
//   players.map(player => addEventsToPitcherEntity(player, eventIdSet))
// );

// export const selectStartingTeamBenchPitchers = createSelector([selectTeamBenchPitcherListWithEvents], benchPlayers =>
//   benchPlayers.filter(player => player.isStarting)
// );

export const selectFangraphsToBatters = createSelector([selectTeamBatterList, (state: RootState) => state], (players, state) => {
  const hasFangraphsPlayers = FangraphsBatterProjectionsSelectors.selectTotal(state) > 0;

  return players?.map(player => ({
    ...player,
    fangraphsProjection: hasFangraphsPlayers ? FangraphsBatterProjectionsSelectors.selectById(state, player.sportsUiId) : null,
    fangraphsStats: hasFangraphsPlayers ? FangraphsBatterStatsSelectors.selectById(state, player.sportsUiId) : null,
    // fangraphsProjection: hasFangraphsPlayers ? (fangraphsEntities[player.sportsUiId] as FangraphsPlayerProjectionEntity) : null,
  }));
});

export const selectFangraphsToPitchers = createSelector([selectTeamPitcherList, (state: RootState) => state], (players, state) => {
  const hasFangraphsPlayers = FangraphsPitcherProjectionsSelectors.selectTotal(state) > 0;

  return players?.map(player => ({
    ...player,
    fangraphsProjection: hasFangraphsPlayers ? FangraphsPitcherProjectionsSelectors.selectById(state, player.sportsUiId) : null,
    fangraphsStats: hasFangraphsPlayers ? FangraphsPitcherStatsSelectors.selectById(state, player.sportsUiId) : null,
  }));
});

export const selectStartingBatterFangraphIds = createSelector([selectFangraphsToBatters], players => {
  const playerIds = players.map(p => transformFangraphIds(p));

  return existsFilter(playerIds);
});

export const selectPitcherFangraphIds = createSelector([selectFangraphsToPitchers], players => {
  const playerIds = players.map(p => transformFangraphIds(p));

  return existsFilter(playerIds);
});

export const selectBattersFangraphsStats = createSelector([selectTeamBatterList, (state: RootState) => state], (players, state) =>
  players.map(player => {
    return {
      ...player,
      fangraphsStats: FangraphsBatterStatsSelectors.selectById(state, player.sportsUiId) ?? null,
    };
  })
);

export const selectBattersFangraphsProjections = createSelector([selectTeamBatterList, (state: RootState) => state], (players, state) =>
  players.map(player => {
    return {
      ...player,
      fangraphsProjections: FangraphsBatterProjectionsSelectors.selectById(state, player.sportsUiId) ?? null,
    };
  })
);

export const selectPitchersFangraphsStats = createSelector([selectTeamPitcherList, (state: RootState) => state], (players, state) =>
  players.map(player => {
    return {
      ...player,
      fangraphsStats: FangraphsPitcherStatsSelectors.selectById(state, player.sportsUiId) ?? null,
    };
  })
);

// export const selectFangraphsToPitchers = createSelector(
//   [selectTeamPitcherList, selectFangraphsPitcherEntities, selectFangraphsPitcherTotal],
//   (players, fangraphsEntities, totalFangraphsPlayers) => {
//     const hasFangraphsPlayers = totalFangraphsPlayers > 0;

//     return players.map(player => ({
//       ...player,
//       fangraphsProjection: hasFangraphsPlayers ? (fangraphsEntities[player.sportsUiId] as FangraphsPlayerProjectionEntity) : null,
//     }));
//   }
// );

// export const selectPitcherFangraphIds = createSelector([selectFangraphsToPitchers], players => {
//   const playerIds = players.map(p => transformFangraphIds(p));
//   return existsFilter(playerIds);
// });
