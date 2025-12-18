import { IClientPlayerInfoEntity, IClientProLeagueType, IClientSimplePlayerEntity, PlayerOutlooksMap } from '@/lib/espn-client-models';
import { ClientMlbPosition } from '@/lib/espn-client-models/baseball';
import { IClientPlayerNewsFeedEntity } from '@/lib/espn-client-models/player-news-feed.model';
import { flattenPlayerStats, generateTeamUid, ImageBuilder, normalizeName, SportLeague } from '@/lib/helpers';
import { INJURY_SEVERITY_BY_INJURY_STATUS, INJURY_STATUS_LIST, PLAYER_COMPETITION_STATUS } from '@/lib/injury';
import { CommonPositionEntity } from '@/lib/models';
import { FantasyPlayerNewsEntity } from '@/lib/models/fantasy-player-news-entity.model';
import { FantasyPlayerEntity } from '@/lib/models/fantasy-player.model';
import { SportTypeId } from '@/lib/models/sport-type.model';

export function transformClientPlayerNewsFeed(feed: IClientPlayerNewsFeedEntity): FantasyPlayerNewsEntity {
  const { id, headline, byline, story, images, links, type } = feed;

  const image = images?.[0]?.url ?? null;

  return {
    id: id.toString(),
    headline,
    byline: byline ?? null,
    story,
    image,
    link: links?.mobile?.href ?? null,
    type,
  };
}

export function clientPlayerOutlook(outlooks?: PlayerOutlooksMap) {
  if (!outlooks) return [];

  const weeklyOutlook = outlooks.outlooksByWeek;

  if (!weeklyOutlook) return [];

  return Object.keys(weeklyOutlook)
    .map(k => ({
      week: Number(k),
      outlook: weeklyOutlook[k],
    }))
    .sort((a, b) => b.week - a.week);
}

interface IClientPlayerToFantasyPlayerParams {
  clientPlayer: IClientPlayerInfoEntity;
  sportId: SportTypeId;
  leagueId: IClientProLeagueType;
  teamMap: Record<string, string>;
  positionMap: Record<ClientMlbPosition, Partial<CommonPositionEntity>>;
  sportLeagueMap: Record<IClientProLeagueType, SportLeague>;
}

interface IClientSimplePlayerToFantasyPlayerParams {
  clientPlayer: IClientSimplePlayerEntity;
  sportId: SportTypeId;
  leagueId: IClientProLeagueType;
  teamMap: Record<string, string>;
  positionMap: Record<ClientMlbPosition, Partial<CommonPositionEntity>>;
  sportLeagueMap: Record<IClientProLeagueType, SportLeague>;
}

export function clientSimplePlayerToFantasyPlayer({
  clientPlayer,
  sportId,
  leagueId,
  teamMap,
  positionMap,
  sportLeagueMap,
}: IClientSimplePlayerToFantasyPlayerParams): FantasyPlayerEntity {
  const { id, proTeamId, fullName, defaultPositionId, ownership } = clientPlayer;

  const team = teamMap[proTeamId] as string;
  const league = sportLeagueMap[leagueId];

  return {
    id: id.toString(),
    sportsUiId: `name=${normalizeName(fullName)}~team=${team.toLowerCase()}`,
    name: fullName,
    teamUid: generateTeamUid(sportId, leagueId, proTeamId),
    position: positionMap[defaultPositionId]?.abbrev ?? null,
    img: ImageBuilder({ league }).headshotImgBuilder({ id }),
    team,
    teamId: proTeamId.toString(),
    lastNewsDate: null,
    health: null,
    defaultPositionId,
    percentOwned: ownership ? ownership.percentOwned : 0,
    percentChange: null,
    percentStarted: null,
    stats: null,
    outlookByWeek: [],
  };
}

export function clientPlayerToFantasyPlayer({
  clientPlayer,
  sportId,
  leagueId,
  teamMap,
  positionMap,
  sportLeagueMap,
}: IClientPlayerToFantasyPlayerParams): FantasyPlayerEntity {
  const { proTeamId, defaultPositionId, outlooks, id, fullName, ownership, lastNewsDate } = clientPlayer;

  const team = teamMap[proTeamId] as string;
  const stats = flattenPlayerStats(clientPlayer.stats);
  const outlookByWeek = clientPlayerOutlook(outlooks);
  const injuryStatus = clientPlayer.injuryStatus ? clientPlayer.injuryStatus : PLAYER_COMPETITION_STATUS.Active;
  const league = sportLeagueMap[leagueId];

  const health = {
    isActive: injuryStatus === PLAYER_COMPETITION_STATUS.Active,
    isHealthy: true,
    isInjured: INJURY_STATUS_LIST.includes(injuryStatus as (typeof INJURY_STATUS_LIST)[number]),
    injuryStatus,
    injurySeverity: INJURY_SEVERITY_BY_INJURY_STATUS[injuryStatus],
  };

  return {
    id: id.toString(),
    sportsUiId: `name=${normalizeName(fullName)}~team=${team.toLowerCase()}`,
    name: fullName,
    teamId: proTeamId.toString(),
    teamUid: generateTeamUid(sportId, leagueId, proTeamId),
    position: positionMap[defaultPositionId as ClientMlbPosition]?.abbrev ?? null,
    img: ImageBuilder({ league }).headshotImgBuilder({ id }),
    lastNewsDate,
    health,
    stats,
    team,
    defaultPositionId,
    outlookByWeek,
    percentOwned: ownership ? ownership.percentOwned : 0,
    percentChange: ownership ? ownership.percentChange : 0,
    percentStarted: ownership ? ownership.percentStarted : 0,
  };
}
