import { FANTASY_SPORTS_ABBREVIATION, FantasySportsAbbreviation, SPORT_LEAGUE, SportLeague } from './endpoint-builder';

export interface ImageBuilderInput {
  id: number | string;
  /**
   * @deprecated
   */
  league?: string;
  width?: number;
  height?: number;
}

export function ImageBuilder({ league, sport }: { league?: SportLeague; sport?: FantasySportsAbbreviation }) {
  return class ImageBuilderClass {
    private static readonly _cdn = process.env.ESPN_CDN_A as string | undefined;
    private static readonly _cdnG = process.env.ESPN_CDN_G as string | undefined;
    private static readonly _cdnCombiner = process.env.ESPN_CDN_COMBINER as string | undefined;

    private static _sport = sport;
    private static _league = league;

    static get sportIconImgBuilder(): string {
      return `${this._cdnCombiner}?img=/redesign/assets/img/icons/ESPN-icon-${this._sport?.toLowerCase().replace('ice ', '')}.png&h=100&w=100`;
    }

    static teamLogoImgBuilder({ id, width, height }: ImageBuilderInput): string {
      const w = width ?? 100;
      const h = height ?? 100;

      return `${this._cdn}?img=/i/teamlogos/${this._league}/500/${id}.png&w=${w}&h=${h}&cb=1`;
    }

    static headshotImgBuilder({ id, width, height }: ImageBuilderInput): string {
      const w = width ?? 426;
      const h = height ?? 320;

      return `${this._cdnCombiner}?img=/i/headshots/${this._league}/players/full/${id}.png&w=${w}&h=${h}&cb=1`;
    }

    static get fantasySportLeagueImage() {
      return `${this._cdnG}/lm-static/${this._sport}/images/${this._sport}-shield-icon.svg`;
    }
  };
}

export class BaseballImageHelper extends ImageBuilder({ league: SPORT_LEAGUE.MLB, sport: FANTASY_SPORTS_ABBREVIATION.Baseball }) {}
