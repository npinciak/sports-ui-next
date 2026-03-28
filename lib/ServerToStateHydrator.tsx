'use client';

import { useEffect } from 'react';
import { BaseballLeagueActions } from './features/baseball';
import { FangraphsBatterProjectionsActions } from './features/baseball/fangraphs-batters-projections.slice';
import { FangraphsBatterStatsActions } from './features/baseball/fangraphs-batters-stats.slice';
import { FangraphsPitcherProjectionsActions } from './features/baseball/fangraphs-pitchers-projections.slice';
import { FangraphsPitcherStatsActions } from './features/baseball/fangraphs-pitchers-stats.slice';
import { BaseballTeamRosterActions } from './features/baseball/roster.slice';
import { useAppDispatch } from './hooks';
import { BaseballLeague, BaseballPlayerEntity } from './models/baseball';
import { FangraphsPlayerProjectionEntity } from './models/fangraphs';
import { FangraphsBatterStatsEntity, FangraphsPitcherStatsEntity } from './models/fangraphs/player-stats.model';

interface ServerStateHydratorProps {
  leagueInfo?: BaseballLeague;
  teamRoster?: BaseballPlayerEntity[];
  fangraphsBattingLeaders?: FangraphsBatterStatsEntity[];
  fangraphsBattingProjections?: FangraphsPlayerProjectionEntity[];
  fangraphsPitchingLeaders?: FangraphsPitcherStatsEntity[];
  fangraphsPitchingProjections?: FangraphsPlayerProjectionEntity[];
}

export default function ServerStateHydrator({
  leagueInfo,
  teamRoster,
  fangraphsBattingLeaders,
  fangraphsBattingProjections,
  fangraphsPitchingLeaders,
  fangraphsPitchingProjections,
}: ServerStateHydratorProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (leagueInfo) {
      if (leagueInfo.teams) {
        dispatch(BaseballLeagueActions.setTeams(leagueInfo.teams));
      }

      // Hydrate league info
      dispatch(
        BaseballLeagueActions.setLeagueInfo({
          id: leagueInfo.id || null,
          seasonId: leagueInfo.seasonId || null,
          scoringPeriodId: leagueInfo.scoringPeriodId || null,
          firstScoringPeriod: leagueInfo.firstScoringPeriod || null,
          finalScoringPeriod: leagueInfo.finalScoringPeriod || null,
          matchupPeriodCount: leagueInfo.matchupPeriodCount || null,
        })
      );
    }

    if (teamRoster && teamRoster.length > 0) {
      dispatch(BaseballTeamRosterActions.setAll(teamRoster));
    }

    if (fangraphsBattingLeaders && fangraphsBattingLeaders.length > 0) {
      dispatch(FangraphsBatterStatsActions.setAll(fangraphsBattingLeaders));
    }

    if (fangraphsBattingProjections && fangraphsBattingProjections.length > 0) {
      dispatch(FangraphsBatterProjectionsActions.setAll(fangraphsBattingProjections));
    }

    if (fangraphsPitchingLeaders && fangraphsPitchingLeaders.length > 0) {
      dispatch(FangraphsPitcherStatsActions.setAll(fangraphsPitchingLeaders));
    }

    if (fangraphsPitchingProjections && fangraphsPitchingProjections.length > 0) {
      dispatch(FangraphsPitcherProjectionsActions.setAll(fangraphsPitchingProjections));
    }
  }, [
    dispatch,
    leagueInfo,
    teamRoster,
    fangraphsBattingLeaders,
    fangraphsPitchingLeaders,
    fangraphsBattingProjections,
    fangraphsPitchingProjections,
  ]);

  return null;
}
