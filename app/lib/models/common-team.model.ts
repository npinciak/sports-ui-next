/**
 * Base front end team model
 *
 * Any team related models should extend this model
 */
export interface CommonTeamEntity {
  id: string;
  name: string;
  abbrev: string;
  logo: string;
}

export type TeamEntityMap = Record<string, CommonTeamEntity>;
export type PartialTeamEntity = Partial<CommonTeamEntity>;
