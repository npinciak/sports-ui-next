import { FANTASY_SPORTS_ABBREVIATION } from './endpoint-builder.const';
import { FantasySportsAbbreviation } from './endpoint-builder.model';

interface EspnEndpointBuilderProps {
  fantasySport: FantasySportsAbbreviation;
}

export function EspnEndpointBuilder({ fantasySport }: EspnEndpointBuilderProps) {
  return class EspnEndpointBuilderClass {
    static getLeague(year: string, leagueId: string) {
      return `${this.espnFantasyEndpointV3}/games/${fantasySport}/seasons/${year}/segments/0/leagues/${leagueId}`;
    }

    static getTeam(year: string, leagueId: string, teamId: string) {
      return `${this.espnFantasyEndpointV3}/games/${fantasySport}/seasons/${year}/segments/0/leagues/${leagueId}/teams/${teamId}`;
    }

    private static get baseEspnUrl(): string {
      const endpoint = process.env.ESPN_BASE as string | undefined;

      if (endpoint == undefined) throw new Error('ESPN_BASE is not defined in .env file');

      return endpoint;
    }

    private static get espnFantasyEndpointV3() {
      const endpoint = process.env.ESPN_FANTASY_BASE_V3 as string | undefined;

      if (endpoint == undefined) throw new Error('ESPN_FANTASY_BASE_V3 is not defined in .env file');

      return endpoint;
    }
  };
}

export class FantasyBaseballEndpointBuilder extends EspnEndpointBuilder({ fantasySport: FANTASY_SPORTS_ABBREVIATION.Baseball }) {}
export class FantasyFootballEndpointBuilder extends EspnEndpointBuilder({ fantasySport: FANTASY_SPORTS_ABBREVIATION.Football }) {}

export class ApiEndpointConfiguration {
  static get baseEspnUrl(): string {
    const endpoint = process.env.ESPN_BASE as string | undefined;

    if (endpoint == undefined) throw new Error('VITE_ESPN_BASE is not defined in .env file');

    return endpoint;
  }

  static get baseEspnEndpointV2() {
    return `${ApiEndpointConfiguration.baseEspnUrl}/v2`;
  }

  static get espnFantasyEndpointV2() {
    return `${ApiEndpointConfiguration.baseEspnUrl}/fantasy/v2`;
  }

  static get espnFantasyEndpointV3() {
    const endpoint = process.env.ESPN_FANTASY_BASE_V3 as string | undefined;

    if (endpoint == undefined) throw new Error('VITE_ESPN_FANTASY_BASE_V3 is not defined in .env file');

    return endpoint;
  }

  static get espnFastcastWebsocketConnectionUrl() {
    const endpoint = process.env.ESPN_FASTCAST_CONNECTION_URL as string | undefined;

    if (endpoint == undefined) throw new Error('VITE_ESPN_FASTCAST_CONNECTION_URL is not defined in .env file');

    return endpoint;
  }

  static get tomorrowIoKey(): string {
    const key = process.env.TOMORROW_IO as string | undefined;

    if (key == undefined) throw new Error('VITE_TOMORROW_IO is not defined in .env file');

    return key;
  }
}
