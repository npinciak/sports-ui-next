/**
 * Base frontend player model
 *
 * Any player related models should extend this model
 */
export interface CommonPlayerEntity {
  id: string;
  name: string;
  img: string;
  team: string;
  teamId: string;
  teamUid: string;
  position: string;
}
