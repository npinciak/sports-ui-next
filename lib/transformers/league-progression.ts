import { LeagueProgression } from '../models/league-progression.model';
import { Database } from '../supabase/database.model';

export function transformClientLeagueProgressionToLeagueProgression(
  clientLeagueProgression: Database['public']['Tables']['league_progression']['Row']
): LeagueProgression {
  return {
    id: clientLeagueProgression.id,
    espnLeagueId: clientLeagueProgression.espn_league_id,
    espnLeagueTeamId: clientLeagueProgression.espn_league_team_id,
    leagueRank: clientLeagueProgression.league_rank,
    totalPoints: clientLeagueProgression.total_points,
    scoringPeriodId: clientLeagueProgression.espn_scoring_period_id,
    createdAt: clientLeagueProgression.created_at,
  };
}
