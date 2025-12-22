import {
  ClientTradeBlockStatus,
  ClientTransactionStatus,
  IClientLeagueTransactionEntity,
  IClientLeagueTransactionItemEntity,
  IClientProLeagueType,
  IClientScheduleTeamEntity,
  IClientSimplePlayerEntity,
  IClientTeamEntity,
  IClientTeamRosterEntity,
  TRADE_BLOCK_STATUS,
  TRANSACTION_STATUS,
} from '@/lib/espn-client-models';
import {
  BASEBALL_LINEUP_MAP,
  ClientBaseballLineupSlot,
  LINEUP_DISPLAY_SET,
  PITCHING_LINEUP_IDS,
} from '@/lib/espn-client-models/baseball/lineup';
import { MLB_POSITION_MAP } from '@/lib/espn-client-models/baseball/position';
import { MLB_TEAM_MAP } from '@/lib/espn-client-models/baseball/team';
import { IClientBaseballLeague } from '@/lib/espn-client-models/league.model';
import { LineupEntityMap } from '@/lib/espn-client-models/lineup.model';
import { SPORT_LEAGUE_BY_PRO_LEAGUE_TYPE } from '@/lib/espn-client-models/sport-league.model';
import { FangraphsPlayerProjectionEntity } from '@/lib/models/baseball';
import { BaseballLeague } from '@/lib/models/baseball/baseball-league.model';
import { BaseballPlayerEntity } from '@/lib/models/baseball/baseball-player.model';
import { BaseballTeamEntity, BaseballTeamLiveEntity, BaseballTeamNoRosterEntity } from '@/lib/models/baseball/baseball-team.model';
import { BaseballTransactionEntity } from '@/lib/models/baseball/baseball-transaction.model';
import { IFantasyLeague } from '@/lib/models/fantasy-league.model';
import { SPORT_TYPE_ID } from '@/lib/models/sport-type.model';
import * as DateFns from 'date-fns';
import { enUS } from 'date-fns/locale';
import { clientPlayerToFantasyPlayer, clientSimplePlayerToFantasyPlayer } from './fantasy-player.transformers';

export function clientScheduleTeamListToTeamListV2(team: IClientScheduleTeamEntity): BaseballTeamLiveEntity {
  const { totalPoints, teamId, totalPointsLive } = team;

  return {
    id: teamId.toString(),
    totalPoints,
    liveScore: totalPointsLive ? totalPointsLive : 0,
    roster: [],
  };
}

export function clientSimplePlayerToBaseballPlayer(clientPlayer: IClientSimplePlayerEntity): BaseballPlayerEntity {
  const { eligibleSlots } = clientPlayer;

  const playerInfo = clientSimplePlayerToFantasyPlayer({
    clientPlayer,
    sportId: SPORT_TYPE_ID.BASEBALL,
    leagueId: IClientProLeagueType.MLB,
    teamMap: MLB_TEAM_MAP,
    positionMap: MLB_POSITION_MAP,
    sportLeagueMap: SPORT_LEAGUE_BY_PRO_LEAGUE_TYPE,
  });

  const eligibleLineupSlots = playerEligibleLineupSlotDisplay(eligibleSlots ?? [], LINEUP_DISPLAY_SET, BASEBALL_LINEUP_MAP);

  return {
    ...playerInfo,
    lineupSlotId: ClientBaseballLineupSlot.None,
    isInStartingLineup: false,
    isNotInStartingLineup: false,
    playerRatings: null,
    isPitcher: isPitcher(eligibleSlots ?? [], PITCHING_LINEUP_IDS),
    lineupSlot: null,
    starterStatusByProGame: null,
    eligibleLineupSlots,
  };
}

export function transformClientLeagueToBaseballLeagueV2(
  client: IClientBaseballLeague | null,
  genericLeagueSettings: IFantasyLeague | null
): BaseballLeague {

  if (!client)
    throw new Error('Client league data is null');

  if (!genericLeagueSettings)
    throw new Error('Generic league settings is null');

  const teams = client.teams.map(t => clientLeagueTeamListToLeagueTeamList(t)).sort((a, b) => (a.currentRank) - (b.currentRank));
  const transactions = client.transactions ? client.transactions.map(t => transformTransactionToBaseballTransaction(t)) : [];

  return {
    ...genericLeagueSettings,
    teams,
    teamsLive: [],
    freeAgents: [],
    transactions,
  };
}

function transformTransactionToBaseballTransaction(transaction: IClientLeagueTransactionEntity): BaseballTransactionEntity {
  const { id, memberId, bidAmount, executionType, isPending, status, type, processDate, proposedDate } = transaction;

  const transactionProcessDate = processDate ? DateFns.format(processDate, 'MM-dd-yy', { locale: enUS }) : null;
  const transactionProposedDate = proposedDate ? DateFns.format(proposedDate, 'MM-dd-yy', { locale: enUS }) : null;

  const items = transaction.items?.map(item => transformTransactionItems(item, BASEBALL_LINEUP_MAP, status)) ?? [];

  return {
    id,
    processedBy: memberId,
    bidAmount,
    executionType,
    isPending,
    status,
    type,
    transactionProcessDateTimestamp: processDate ? processDate : null,
    transactionProposedDateTimestamp: proposedDate ? proposedDate : null,
    transactionProcessDate,
    transactionProposedDate,
    items: [],
  };
}

function transformTransactionItems(
  item: IClientLeagueTransactionItemEntity,
  lineupMap: LineupEntityMap,
  transactionStatus: ClientTransactionStatus
) {
  const { playerId, fromLineupSlotId, fromTeamId, toLineupSlotId, toTeamId, type } = item;

  const transactionSuccess = transactionStatus === TRANSACTION_STATUS.Executed;

  return {
    fromLineupSlot: transactionSuccess ? lineupMap[fromLineupSlotId].abbrev : null,
    toLineupSlot: transactionSuccess ? lineupMap[toLineupSlotId].abbrev : null,
    fromLineupSlotId,
    toLineupSlotId,
    fromTeamId: fromTeamId.toString(),
    toTeamId: toTeamId.toString(),
    playerId: playerId.toString(),
    playerName: null,
    type,
  };
}

export function playerEligibleLineupSlotDisplay(
  val: ClientBaseballLineupSlot[],
  lineupSlotSet: Set<ClientBaseballLineupSlot>,
  lineupMap: LineupEntityMap
): string {
  if (val.length === 0) return 'None';
  return val
    .filter(slot => lineupSlotSet.has(slot))
    .map(slot => lineupMap[slot].abbrev)
    .join(', ');
}

export function isPitcher(eligiblePos: number[], lineupSlotSet: Set<ClientBaseballLineupSlot>): boolean {
  if (eligiblePos.length === 0) return false;
  return eligiblePos.some(posId => lineupSlotSet.has(posId));
}

export function clientLeagueTeamListToLeagueTeamList(team: IClientTeamEntity): BaseballTeamNoRosterEntity {
  const { abbrev, logo, valuesByStat, pointsByStat, name, tradeBlock, transactionCounter } = team;

  const hasTradeablePlayers = tradeBlock.hasOwnProperty('players')
    ? Object.values(tradeBlock.players as Record<string, ClientTradeBlockStatus>).some(p => p === TRADE_BLOCK_STATUS.ON_THE_BLOCK)
    : false;

  return {
    id: team.id.toString(),
    name,
    abbrev,
    logo,
    totalPoints: team.points,
    currentRank: team.playoffSeed,
    valuesByStat,
    pointsByStat,
    liveScore: 0,
    hasTradeablePlayers,
    transactionCounter,
  };
}

export function clientTeamToBaseballTeam(team: IClientTeamEntity | null): BaseballTeamEntity | null {
  if (!team) return null;

  const {
    roster: { entries },
  } = team;

  const basicTeam = clientLeagueTeamListToLeagueTeamList(team);

  const roster = entries.map(player => clientPlayerToBaseballPlayer(player));

  return {
    ...basicTeam,
    roster,
  };
}

export function clientPlayerToBaseballPlayer(player: IClientTeamRosterEntity): BaseballPlayerEntity {
  if (!player.playerPoolEntry) throw new Error('player.playerPoolEntry must be defined');

  const {
    lineupSlotId,
    playerPoolEntry: {
      player: { lastNewsDate, eligibleSlots },
      ratings,
    },
  } = player;

  const playerInfo = clientPlayerToFantasyPlayer({
    clientPlayer: player.playerPoolEntry.player,
    sportId: SPORT_TYPE_ID.BASEBALL,
    leagueId: IClientProLeagueType.MLB,
    teamMap: MLB_TEAM_MAP,
    positionMap: MLB_POSITION_MAP,
    sportLeagueMap: SPORT_LEAGUE_BY_PRO_LEAGUE_TYPE,
  });

  const eligibleLineupSlots = playerEligibleLineupSlotDisplay(eligibleSlots, LINEUP_DISPLAY_SET, BASEBALL_LINEUP_MAP);
  const starterStatusByProGame = player.playerPoolEntry.player.starterStatusByProGame ?? null;

  return {
    ...playerInfo,
    playerRatings: ratings,
    isPitcher: isPitcher(eligibleSlots ?? [], PITCHING_LINEUP_IDS),
    lineupSlotId,
    isInStartingLineup: false,
    isNotInStartingLineup: false,
    lineupSlot: BASEBALL_LINEUP_MAP[lineupSlotId].abbrev,
    starterStatusByProGame,
    eligibleLineupSlots,
    lastNewsDate,
  };
}

export function mapFangraphsPlayersToBaseballTeam(
  espnPlayers: BaseballPlayerEntity[],
  fangraphsPlayerMap: Record<string, FangraphsPlayerProjectionEntity>
) {
  return espnPlayers?.map(player => {
    return fangraphsPlayerMap
      ? {
        ...player,
        fangraphsProjection: {
          ...(fangraphsPlayerMap[player.sportsUiId] as object),
        },
      }
      : null;
  });
}

export function mapBaseballTeamToFangraphsPlayers(espnPlayers: BaseballPlayerEntity[], fangraphsPlayerMap: Record<string, unknown>) {
  return espnPlayers?.map(player => {
    return fangraphsPlayerMap
      ? {
        ...player,
        fangraphsProjection: {
          ...(fangraphsPlayerMap[player.sportsUiId] as object),
        },
      }
      : null;
  });
}
