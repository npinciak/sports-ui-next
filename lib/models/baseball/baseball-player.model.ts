import { IClientPlayerRatingsMapByTimePeriod, IClientTeamRosterEntity } from '@/lib/espn-client-models';
import { PlayerCompetitionStatus } from '@/lib/injury';
import { CommonPlayerEntity } from '../common-player.model';
import { FangraphsPlayerProjectionEntity } from '../fangraphs';
import { FangraphsBatterStatsEntity, FangraphsPitcherStatsEntity } from '../fangraphs/player-stats.model';
import { FantasyPlayerEntity } from '../fantasy-player.model';

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

export interface BaseballPlayerWithFangraphsProjections extends BaseballPlayerEntity {
  fangraphsProjection: FangraphsPlayerProjectionEntity | null;
}

export interface BatterWithFangraphsStats extends BaseballPlayerEntity {
  fangraphsStats: FangraphsBatterStatsEntity | null;
}

export interface PitcherWithFangraphsStats extends BaseballPlayerEntity {
  fangraphsStats: FangraphsPitcherStatsEntity | null;
}
