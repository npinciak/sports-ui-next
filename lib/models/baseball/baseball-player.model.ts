import { IClientPlayerRatingsMapByTimePeriod, IClientTeamRosterEntity } from '@/lib/espn-client-models';
import { PlayerCompetitionStatus } from '@/lib/injury';
import { CommonPlayerEntity } from '../common-player.model';
import { FantasyPlayerEntity } from '../fantasy-player.model';
import { FangraphsPlayerProjectionEntity } from './player-projections.model';

export interface BaseballPlayerEntity extends FantasyPlayerEntity {
  lineupSlotId: number;
  isInStartingLineup: boolean;
  isNotInStartingLineup: boolean;
  playerRatings: IClientPlayerRatingsMapByTimePeriod | null;
  isPitcher: boolean;
  lineupSlot: string | null;
  starterStatusByProGame: Record<number, PlayerCompetitionStatus> | null;
  eligibleLineupSlots: string;
  sportsUiId: string;
}

export interface BaseballPlayerStatsRowEntity
  extends
  Omit<CommonPlayerEntity, 'teamId' | 'teamUid'>,
  Pick<BaseballPlayerEntity, 'eligibleLineupSlots' | 'percentChange' | 'percentOwned' | 'percentStarted'>,
  Pick<IClientTeamRosterEntity, 'lineupSlotId'> {
  highlightedPlayer: boolean;
  stats: Record<number, number>;
}

export interface BaseballPlayerWithFangraphsEntity extends BaseballPlayerEntity {
  fangraphsProjection: FangraphsPlayerProjectionEntity | null;
}
