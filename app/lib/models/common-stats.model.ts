/**
 * Base front end stats model
 *
 * Any stats related models should extend this model
 */
export interface CommonStatEntity {
  id: string;
  abbrev: string;
  description: string;
}
