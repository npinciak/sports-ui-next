export interface IFantasyLeague {
  id: string;
  name: string;
  size: number;
  scoringType: 'ROTO' | 'H2H_POINTS';
  seasonId: string;
  scoringPeriodId: string;
  firstScoringPeriod: string;
  finalScoringPeriod: string;
  matchupPeriodCount: string;
}
