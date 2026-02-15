import { ClientBaseballLineupSlot } from '@/lib/espn-client-models/baseball';
import { LineupEntityMap } from '@/lib/espn-client-models/lineup.model';
import { BaseballPlayerEntity, BaseballPlayerStatsRowEntity } from '@/lib/models/baseball';

function isInStartingLineup(player: BaseballPlayerEntity, lineupMap: LineupEntityMap): boolean {
  const { lineupSlotId } = player;

  const isBench = lineupMap[lineupSlotId].bench;
  const isInjuryList = lineupSlotId === ClientBaseballLineupSlot.IL;
  const isPitcherTwo = lineupSlotId === ClientBaseballLineupSlot.P2;

  return !isBench && !isInjuryList && !isPitcherTwo;
}

function isOnBench(player: BaseballPlayerEntity, lineupMap: LineupEntityMap): boolean {
  const { lineupSlotId } = player;

  const isBench = lineupMap[lineupSlotId].bench;
  const isInjured = player.health?.isInjured;

  return isBench && !isInjured;
}

export function benchPlayersFilter(players: BaseballPlayerEntity[], lineupMap: LineupEntityMap): BaseballPlayerEntity[] {
  const playerList = players.filter(p => isOnBench(p, lineupMap));

  return sortPlayersByLineupSlotDisplayOrder(playerList, lineupMap);
}

export function startingPlayersFilter(players: BaseballPlayerEntity[], lineupMap: LineupEntityMap): BaseballPlayerEntity[] {
  const playerList = players.filter(p => isInStartingLineup(p, lineupMap));
  return sortPlayersByLineupSlotDisplayOrder(playerList, lineupMap);
}

export function sortPlayersByLineupSlotDisplayOrder<T extends BaseballPlayerEntity | BaseballPlayerStatsRowEntity>(
  players: T[],
  lineupMap: LineupEntityMap
): T[] {
  return players.sort((a, b) => lineupMap[a.lineupSlotId].displayOrder - lineupMap[b.lineupSlotId].displayOrder);
}
