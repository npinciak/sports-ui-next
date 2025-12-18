import { IClientLeague } from '../espn-client-models/league.model';
import { IFantasyLeague } from '../models/fantasy-league.model';

export function clientLeagueToLeagueSettings(league: IClientLeague | null): IFantasyLeague | null {
  if (!league) return null;

  const {
    id,
    seasonId,
    scoringPeriodId,
    status: { firstScoringPeriod, finalScoringPeriod },
    settings: {
      scheduleSettings: { matchupPeriodCount },
      scoringSettings: { scoringType },
      name,
      size,
    },
  } = league;

  return {
    id: id.toString(),
    name,
    size,
    scoringType,
    seasonId: seasonId.toString(),
    scoringPeriodId: scoringPeriodId.toString(),
    firstScoringPeriod: firstScoringPeriod.toString(),
    finalScoringPeriod: finalScoringPeriod.toString(),
    matchupPeriodCount: matchupPeriodCount.toString(),
  };
}
