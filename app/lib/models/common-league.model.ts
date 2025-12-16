/**
 * Base front end league model
 *
 * Any league related models should extend this model
 */
export interface CommonLeagueEntity {
  id: string;
  name: string;
  abbreviation: string;
}
