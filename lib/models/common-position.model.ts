/**
 * Base front end position model
 *
 * Any position related models should extend this model
 *
 */
export interface CommonPositionEntity {
  id: string;
  abbrev: string;
  name: string;
}

export type PartialPositionEntity = Partial<CommonPositionEntity>;
