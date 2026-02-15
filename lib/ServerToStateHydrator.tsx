'use client';

import { useEffect } from 'react';
import { BaseballLeagueActions } from './features/baseball';
import { BaseballTeamRosterActions } from './features/baseball/roster.slice';
import { useAppDispatch } from './hooks';
import { BaseballLeague, BaseballPlayerEntity } from './models/baseball';
import { FangraphsPlayerStatEntity } from './models/fangraphs';

interface ServerStateHydratorProps {
  leagueInfo?: BaseballLeague;
  teamRoster?: BaseballPlayerEntity[];
  fangraphsBattingLeaders?: FangraphsPlayerStatEntity[];
  fangraphsPitchingLeaders?: FangraphsPlayerStatEntity[];
}

export default function ServerStateHydrator({
  leagueInfo,
  teamRoster,
  fangraphsBattingLeaders,
  fangraphsPitchingLeaders,
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

    if (teamRoster) {
      dispatch(BaseballTeamRosterActions.setAll(teamRoster));
    }
  }, [dispatch, leagueInfo, teamRoster]);

  return null;
}
