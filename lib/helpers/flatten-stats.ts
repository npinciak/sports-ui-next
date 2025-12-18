import { IClientPlayerStatsYearEntity } from '../espn-client-models';

/**
 * Flatten player stats
 *
 * @param stats
 * @returns
 */
export function flattenPlayerStats(
  stats?: IClientPlayerStatsYearEntity[] | null
): Record<string, IClientPlayerStatsYearEntity | null> | null {
  if (!stats) return null;

  return stats.reduce<Record<string, IClientPlayerStatsYearEntity | null>>((result, stat) => {
    result[stat.id] = stat;
    return result;
  }, {});
}
