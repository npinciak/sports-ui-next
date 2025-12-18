import { IClientPlayerStatsYearEntity } from '../espn-client-models';
import { InjurySeverity, PlayerCompetitionStatus } from '../injury';

export interface FantasyPlayerEntity extends CommonPlayerEntity {
  sportsUiId: string;
  lastNewsDate: number | null;
  health: FantasyPlayerHealth | null;
  defaultPositionId: number | null;
  percentOwned: number | null;
  percentChange: number | null;
  percentStarted: number | null;
  stats: { [year: string]: IClientPlayerStatsYearEntity | null } | null;
  outlookByWeek: FantasyPlayerOutlookByWeek[];
}

export interface FantasyPlayerHealth {
  isActive: boolean;
  isHealthy: boolean;
  isInjured: boolean;
  injuryStatus: PlayerCompetitionStatus;
  injurySeverity: InjurySeverity;
}

interface FantasyPlayerOutlookByWeek {
  week: number;
  outlook: string;
}
