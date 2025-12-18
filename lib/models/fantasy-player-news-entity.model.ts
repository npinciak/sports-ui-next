import { IClientArticleType } from '../espn-client-models';

export interface FantasyPlayerNewsEntity {
  id: string;
  headline: string | null;
  story: string | null;
  byline: string | null;
  image: string | null;
  link: string | null;
  type: IClientArticleType;
}
