import { BaseballPlayerEntity, FangraphsPlayerProjectionEntity } from '@/lib/models/baseball';
import { normalizeName } from '../normalize-name';

const FangraphsTeamToEspnTeam: Record<string, string> = {};

interface GenerateSportsUiPlayerIdParams {
  espnPlayer: BaseballPlayerEntity;
  fangraphsPlayer: FangraphsPlayerProjectionEntity;
}

export function generateSportsUiPlayerId({ espnPlayer, fangraphsPlayer }: GenerateSportsUiPlayerIdParams): {
  normalizedEspnId: string;
  normalizedFangraphsId: string;
} {
  const espnTeam = espnPlayer.team ? espnPlayer.team.toLowerCase() : '';
  const fangraphsTeam = fangraphsPlayer.Team ? FangraphsTeamToEspnTeam[fangraphsPlayer.Team].toLowerCase() : '';

  const normalizedEspnId = `name=${normalizeName(espnPlayer.name)}~team=${espnTeam}`;
  const normalizedFangraphsId = `name=${normalizeName(fangraphsPlayer.PlayerName)}~team=${fangraphsTeam}`;

  return {
    normalizedEspnId,
    normalizedFangraphsId,
  };
}
