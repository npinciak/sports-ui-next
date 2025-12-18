import { IClientTeamEntity, IClientTransactionCounter } from '@/lib/espn-client-models';
import { CommonTeamEntity } from '../common-team.model';
import { BaseballPlayerEntity } from './baseball-player.model';

export interface BaseballTeamEntity extends CommonTeamEntity, Pick<IClientTeamEntity, 'valuesByStat' | 'pointsByStat'> {
  abbrev: string;
  roster: BaseballPlayerEntity[];
  totalPoints: number;
  currentRank: number;
  liveScore: number | null;
  hasTradeablePlayers: boolean;
  transactionCounter: IClientTransactionCounter;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseballTeamNoRosterEntity extends Omit<BaseballTeamEntity, 'roster'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseballTeamLiveEntity extends Pick<BaseballTeamEntity, 'id' | 'totalPoints' | 'liveScore' | 'roster'> {}
