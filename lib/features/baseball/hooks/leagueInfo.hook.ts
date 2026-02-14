import { BaseballLeagueActions } from '@/lib/features/baseball';
import { useAppDispatch } from '@/lib/hooks';
import { IFantasyLeague } from '@/lib/models/fantasy-league.model';
import { useRef } from 'react';

export function useLeagueInfo(league: IFantasyLeague | null) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  if (!initialized.current && league) {
    dispatch(
      BaseballLeagueActions.setLeagueInfo({
        id: league.id || null,
        seasonId: league.seasonId || null,
        scoringPeriodId: league.scoringPeriodId || null,
        firstScoringPeriod: league.firstScoringPeriod || null,
        finalScoringPeriod: league.finalScoringPeriod || null,
        matchupPeriodCount: league.matchupPeriodCount || null,
      })
    );
    initialized.current = true;
  }
}
