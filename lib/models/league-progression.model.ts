export interface LeagueProgression {
  id: number;
  espnLeagueId: number | null;
  espnLeagueTeamId: number | null;
  leagueRank: number;
  totalPoints: number;
  createdAt: string;
}
