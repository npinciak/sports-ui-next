// Common interface for shared Fangraphs player data
export interface FangraphsCommonPlayerEntity {
  // Basic player info
  xMLBAMID: number;
  Name: string;
  Team: string;
  Season: number;
  Age: number;
  AgeR: string;
  SeasonMin: number;
  SeasonMax: number;

  // Games and basic counting stats (shared)
  G: number;
  H: number;
  BB: number;
  IBB: number;
  SO: number;
  HBP: number;
  HR: number;

  // Batted ball data
  GB: number;
  FB: number;
  LD: number;
  IFFB: number;
  Pitches: number;
  Balls: number;
  Strikes: number;
  IFH: number;
  BU: number;
  BUH: number;

  // Basic rates
  AVG: number;
  BABIP: number;
  'GB/FB': number;
  'LD%': number;
  'GB%': number;
  'FB%': number;
  'IFFB%': number;
  'HR/FB': number;
  'IFH%': number;
  'BUH%': number;
  'TTO%': number;

  // War and value metrics
  RAR: number;
  WAR: number;
  WAROld: number;
  Dollars: number;

  // Win probability added
  WPA: number;
  '-WPA': number;
  '+WPA': number;
  RE24: number;
  REW: number;
  pLI: number;
  'WPA/LI': number;
  Clutch: number;

  // Pitch type data
  'FB%1': number;
  FBv: number;
  'SL%': number;
  SLv: number;
  'CB%': number;
  CBv: number;
  'CH%': number;
  CHv: number;
  wFB: number;
  wSL: number;
  wCB: number;
  wCH: number;
  'wFB/C': number;
  'wSL/C': number;
  'wCB/C': number;
  'wCH/C': number;

  // Plate discipline metrics
  'O-Swing%': number;
  'Z-Swing%': number;
  'Swing%': number;
  'O-Contact%': number;
  'Z-Contact%': number;
  'Contact%': number;
  'Zone%': number;
  'F-Strike%': number;
  'SwStr%': number;
  'CStr%': number;
  'C+SwStr%': number;

  // Contact quality
  Pull: number;
  Cent: number;
  Oppo: number;
  Soft: number;
  Med: number;
  Hard: number;
  bipCount: number;
  'Pull%': number;
  'Cent%': number;
  'Oppo%': number;
  'Soft%': number;
  'Med%': number;
  'Hard%': number;

  // Team value metrics
  PPTV: number;
  CPTV: number;
  BPTV: number;
  DSV: number;
  DGV: number;
  BTV: number;
  EBV: number;
  ESV: number;
  rFTeamV: number;
  rBTeamV: number;
  rTV: number;

  // PITCHf/x data (core fields)
  'pfxFA%': number;
  'pfxSI%': number;
  'pfxSL%': number;
  'pfxCU%': number;
  'pfxCH%': number;
  pfxvFA: number;
  pfxvSI: number;
  pfxvSL: number;
  pfxvCU: number;
  pfxvCH: number;
  'pfxFA-X': number;
  'pfxSI-X': number;
  'pfxSL-X': number;
  'pfxCU-X': number;
  'pfxCH-X': number;
  'pfxFA-Z': number;
  'pfxSI-Z': number;
  'pfxSL-Z': number;
  'pfxCU-Z': number;
  'pfxCH-Z': number;
  pfxwFA: number;
  pfxwSI: number;
  pfxwSL: number;
  pfxwCU: number;
  pfxwCH: number;
  'pfxwFA/C': number;
  'pfxwSI/C': number;
  'pfxwSL/C': number;
  'pfxwCU/C': number;
  'pfxwCH/C': number;
  'pfxO-Swing%': number;
  'pfxZ-Swing%': number;
  'pfxSwing%': number;
  'pfxO-Contact%': number;
  'pfxZ-Contact%': number;
  'pfxContact%': number;
  'pfxZone%': number;
  pfxPace: number;

  // PITCHInfo data (core fields)
  'piCH%': number;
  'piCU%': number;
  'piFA%': number;
  'piSI%': number;
  'piSL%': number;
  pivCH: number;
  pivCU: number;
  pivFA: number;
  pivSI: number;
  pivSL: number;
  'piCH-X': number;
  'piCU-X': number;
  'piFA-X': number;
  'piSI-X': number;
  'piSL-X': number;
  'piCH-Z': number;
  'piCU-Z': number;
  'piFA-Z': number;
  'piSI-Z': number;
  'piSL-Z': number;
  piwCH: number;
  piwCU: number;
  piwFA: number;
  piwSI: number;
  piwSL: number;
  'piwCH/C': number;
  'piwCU/C': number;
  'piwFA/C': number;
  'piwSI/C': number;
  'piwSL/C': number;
  'piO-Swing%': number;
  'piZ-Swing%': number;
  'piSwing%': number;
  'piO-Contact%': number;
  'piZ-Contact%': number;
  'piContact%': number;
  'piZone%': number;
  piPace: number;

  // Statcast
  Events: number;
  EV: number;
  LA: number;
  Barrels: number;
  'Barrel%': number;
  maxEV: number;
  HardHit: number;
  'HardHit%': number;
  Q: number;
  TG: number;

  // Player identification
  PlayerNameRoute: string;
  PlayerName: string;
  TeamName: string;
  TeamNameAbb: string;
  teamid: number;
  playerid: number;
}

export interface FangraphsBatterStatsEntity extends FangraphsCommonPlayerEntity {
  // Batting-specific player info
  Bats: string;

  // Batting-specific WAR
  WAROld: number;

  // Batting counting stats
  AB: number;
  PA: number;
  '1B': number;
  '2B': number;
  '3B': number;
  R: number;
  RBI: number;
  SF: number;
  SH: number;
  GDP: number;
  SB: number;
  CS: number;

  // Batting rates and metrics
  'BB%': number;
  'K%': number;
  'BB/K': number;
  OBP: number;
  SLG: number;
  OPS: number;
  ISO: number;

  // Advanced batting metrics
  wOBA: number;
  wRAA: number;
  wRC: number;
  Batting: number;
  Fielding?: number | null;
  Replacement: number;
  Positional: number;
  wLeague: number;
  CFraming?: number | null;
  Defense: number;
  Offense: number;
  BaseRunning: number;
  Spd: number;
  'wRC+': number;
  wBsR: number;

  // Batting situational
  phLI?: number | null;
  PH: number;

  // Batting-specific pitch data (optional fields)
  'CT%': number;
  CTv: number;
  'SF%': number;
  SFv: number;
  'KN%?': number | null;
  KNv?: number | null;
  'XX%?': number | null;
  'PO%?': null;
  wCT: number;
  wSF: number;
  wKN?: number | null;
  'wCT/C': number;
  'wSF/C': number;
  'wKN/C?': number | null;

  // Base running
  UBR: number;
  GDPRuns: number;

  // Batting plus stats
  'AVG+': number;
  'BB%+': number;
  'K%+': number;
  'OBP+': number;
  'SLG+': number;
  'ISO+': number;
  'BABIP+': number;
  'LD%+': number;
  'GB%+': number;
  'FB%+': number;
  'HRFB%+': number;
  'Pull%+': number;
  'Cent%+': number;
  'Oppo%+': number;
  'Soft%+': number;
  'Med%+': number;
  'Hard%+': number;

  // Expected metrics
  xwOBA: number;
  xAVG: number;
  xSLG: number;
  XBR: number;

  // Batting-specific team value (optional fields)
  rPPTV?: number | null;
  rCPTV?: null;
  rBPTV?: null;
  rDSV?: null;
  rDGV?: null;
  rBTV?: null;

  // Batting-specific PITCHf/x (optional/different fields)
  'pfxFT%?': null;
  'pfxFC%': number;
  'pfxFS%': number;
  'pfxFO%?': null;
  'pfxKC%': number;
  'pfxEP%?': null;
  'pfxSC%?': null;
  'pfxKN%?': number | null;
  'pfxUN%?': null;
  'pfxvFT?': null;
  pfxvFC: number;
  pfxvFS: number;
  'pfxvFO?': null;
  pfxvKC: number;
  'pfxvEP?': null;
  'pfxvSC?': null;
  'pfxvKN?': number | null;
  'pfxFT-X?': null;
  'pfxFC-X': number;
  'pfxFS-X': number;
  'pfxFO-X?': null;
  'pfxKC-X': number;
  'pfxEP-X?': null;
  'pfxSC-X?': null;
  'pfxKN-X?': number | null;
  'pfxFT-Z?': null;
  'pfxFC-Z': number;
  'pfxFS-Z': number;
  'pfxFO-Z?': null;
  'pfxKC-Z': number;
  'pfxEP-Z?': null;
  'pfxSC-Z?': null;
  'pfxKN-Z?': number | null;
  'pfxwFT?': null;
  pfxwFC: number;
  pfxwFS: number;
  'pfxwFO?': null;
  pfxwKC: number;
  'pfxwEP?': null;
  'pfxwSC?': null;
  'pfxwKN?': number | null;
  'pfxwFT/C?': null;
  'pfxwFC/C': number;
  'pfxwFS/C': number;
  'pfxwFO/C?': null;
  'pfxwKC/C': number;
  'pfxwEP/C?': null;
  'pfxwSC/C?': null;
  'pfxwKN/C?': number | null;

  // Batting-specific PITCHInfo (optional fields)
  'piCS%?': null;
  'piFC%': number;
  'piFS%': number;
  'piKN%?': number | null;
  'piSB%?': null;
  'piXX%?': null;
  'pivCS?': null;
  pivFC: number;
  pivFS: number;
  'pivKN?': number | null;
  'pivSB?': null;
  'pivXX?': null;
  'piCS-X?': null;
  'piFC-X': number;
  'piFS-X': number;
  'piKN-X?': number | null;
  'piSB-X?': null;
  'piXX-X?': null;
  'piCS-Z?': null;
  'piFC-Z': number;
  'piFS-Z': number;
  'piKN-Z?': number | null;
  'piSB-Z?': null;
  'piXX-Z?': null;
  'piwCS?': null;
  piwFC: number;
  piwFS: number;
  'piwKN?': number | null;
  'piwSB?': null;
  'piwXX?': null;
  'piwCS/C?': null;
  'piwFC/C': number;
  'piwFS/C': number;
  'piwKN/C?': number | null;
  'piwSB/C?': null;
  'piwXX/C?': null;

  // Batting plate appearances
  TPA: number;

  // Batting position
  Pos: number;
}

export interface FangraphsPitcherStatsEntity extends FangraphsCommonPlayerEntity {
  // Pitching-specific player info
  Throws: string;

  // Pitching counting stats
  W: number;
  L: number;
  ERA: number;
  GS: number;
  QS: number;
  CG: number;
  ShO: number;
  SV: number;
  BS: number;
  IP: number;
  TBF: number;
  R: number;
  ER: number;
  WP: number;
  BK: number;
  RS: number;

  // Pitching rates
  'K/9': number;
  'BB/9': number;
  'K/BB': number;
  'H/9': number;
  'HR/9': number;
  WHIP: number;
  'LOB%': number;
  FIP: number;

  // Pitching-specific CFraming (non-optional)
  CFraming: number;

  // Pitching role metrics
  Starting: number;
  'Start-IP': number;
  Relieving?: null;
  'Relief-IP'?: null;

  // Pitching-specific wins
  'RA9-Wins': number;
  'LOB-Wins': number;
  'BIP-Wins': number;
  'BS-Wins': number;

  // Pitching-specific advanced metrics
  tERA: number;
  xFIP: number;

  // Pitching-specific situational
  inLI: number;
  gmLI: number;
  exLI: number;
  Pulls: number;
  Games: number;

  // Relief pitching
  HLD: number;
  SD: number;
  MD: number;

  // Pitching negatively adjusted stats
  'ERA-': number;
  'FIP-': number;
  'xFIP-': number;
  'K%': number;
  'BB%': number;
  'K-BB%': number;
  SIERA: number;
  kwERA: number;
  'RS/9': number;
  'E-F': number;

  // Pitching-specific pitch data (optional fields)
  'CT%'?: null;
  CTv?: null;
  'SF%'?: null;
  SFv?: null;
  'KN%'?: null;
  KNv?: null;
  'XX%'?: null;
  'PO%'?: null;
  wCT?: null;
  wSF?: null;
  wKN?: null;
  'wCT/C'?: null;
  'wKN/C'?: null;

  // Pitching plus stats
  'K/9+': number;
  'BB/9+': number;
  'K/BB+': number;
  'H/9+': number;
  'HR/9+': number;
  'AVG+': number;
  'WHIP+': number;
  'BABIP+': number;
  'LOB%+': number;
  'K%+': number;
  'BB%+': number;
  'LD%+': number;
  'GB%+': number;
  'FB%+': number;
  'HRFB%+': number;
  'Pull%+': number;
  'Cent%+': number;
  'Oppo%+': number;
  'Soft%+': number;
  'Med%+': number;
  'Hard%+': number;

  // Pitching expected metrics
  xERA: number;

  // Pitch-by-pitch modeling
  pb_o_CH: number;
  pb_s_CH: number;
  pb_c_CH: number;
  pb_o_CU: number;
  pb_s_CU: number;
  pb_c_CU: number;
  pb_o_FF: number;
  pb_s_FF: number;
  pb_c_FF: number;
  pb_o_SI: number;
  pb_s_SI: number;
  pb_c_SI: number;
  pb_o_SL: number;
  pb_s_SL: number;
  pb_c_SL: number;
  pb_o_KC?: null;
  pb_s_KC?: null;
  pb_c_KC?: null;
  pb_o_FC?: null;
  pb_s_FC?: null;
  pb_c_FC?: null;
  pb_o_FS?: null;
  pb_s_FS?: null;
  pb_c_FS?: null;
  pb_overall: number;
  pb_stuff: number;
  pb_command: number;
  pb_xRV100: number;
  pb_ERA: number;

  // Stuff+ metrics
  sp_s_CH: number;
  sp_l_CH: number;
  sp_p_CH: number;
  sp_s_CU: number;
  sp_l_CU: number;
  sp_p_CU: number;
  sp_s_FF: number;
  sp_l_FF: number;
  sp_p_FF: number;
  sp_s_SI: number;
  sp_l_SI: number;
  sp_p_SI: number;
  sp_s_SL: number;
  sp_l_SL: number;
  sp_p_SL: number;
  sp_s_KC?: null;
  sp_l_KC?: null;
  sp_p_KC?: null;
  sp_s_FC?: null;
  sp_l_FC?: null;
  sp_p_FC?: null;
  sp_s_FS: number;
  sp_l_FS: number;
  sp_p_FS: number;
  sp_s_FO?: null;
  sp_l_FO?: null;
  sp_p_FO?: null;
  sp_stuff: number;
  sp_location: number;
  sp_pitching: number;

  // Pitching-specific team value (non-optional)
  rPPTV?: null;
  rCPTV?: null;
  rBPTV?: null;
  rDSV?: null;
  rDGV?: null;
  rBTV?: null;

  // Pitching-specific PITCHf/x (additional fields)
  'pfxFT%'?: null;
  'pfxFC%'?: null;
  'pfxFS%': number;
  'pfxFO%'?: null;
  'pfxKC%'?: null;
  'pfxEP%'?: null;
  'pfxSC%'?: null;
  'pfxKN%'?: null;
  'pfxUN%'?: null;
  'pfxSLO%': number;
  'pfxST%'?: null;
  'pfxCUO%': number;
  'pfxCV%'?: null;
  pfxvFT?: null;
  pfxvFC?: null;
  pfxvFS: number;
  pfxvFO?: null;
  pfxvKC?: null;
  pfxvEP?: null;
  pfxvSC?: null;
  pfxvKN?: null;
  pfxvSLO: number;
  pfxvST?: null;
  pfxvCUO: number;
  pfxvCV?: null;
  'pfxFT-X'?: null;
  'pfxFC-X'?: null;
  'pfxFS-X': number;
  'pfxFO-X'?: null;
  'pfxKC-X'?: null;
  'pfxEP-X'?: null;
  'pfxSC-X'?: null;
  'pfxKN-X'?: null;
  'pfxSLO-X': number;
  'pfxST-X'?: null;
  'pfxCUO-X': number;
  'pfxCV-X'?: null;
  'pfxFT-Z'?: null;
  'pfxFC-Z'?: null;
  'pfxFS-Z': number;
  'pfxFO-Z'?: null;
  'pfxKC-Z'?: null;
  'pfxEP-Z'?: null;
  'pfxSC-Z'?: null;
  'pfxKN-Z'?: null;
  'pfxSLO-Z': number;
  'pfxST-Z'?: null;
  'pfxCUO-Z': number;
  'pfxCV-Z'?: null;
  pfxwFT?: null;
  pfxwFC?: null;
  pfxwFS: number;
  pfxwFO?: null;
  pfxwKC?: null;
  pfxwEP?: null;
  pfxwSC?: null;
  pfxwKN?: null;
  pfxwSLO: number;
  pfxwST?: null;
  pfxwCUO: number;
  pfxwCV?: null;
  'pfxwFT/C'?: null;
  'pfxwFC/C'?: null;
  'pfxwFS/C': number;
  'pfxwFO/C'?: null;
  'pfxwKC/C'?: null;
  'pfxwEP/C'?: null;
  'pfxwSC/C'?: null;
  'pfxwKN/C'?: null;
  'pfxwSLO/C': number;
  'pfxwST/C'?: null;
  'pfxwCUO/C': number;
  'pfxwCV/C'?: null;
  pfxaaFT?: null;
  pfxaaFC?: null;
  pfxaaFS: number;
  pfxaaFO?: null;
  pfxaaKC?: null;
  pfxaaEP?: null;
  pfxaaSC?: null;
  pfxaaKN?: null;
  pfxaaSLO: number;
  pfxaaST?: null;
  pfxaaCUO: number;
  pfxaaCV?: null;
  pfxspFT?: null;
  pfxspFC?: null;
  pfxspFS: number;
  pfxspFO?: null;
  pfxspKC?: null;
  pfxspEP?: null;
  pfxspSC?: null;
  pfxspKN?: null;
  pfxspSLO: number;
  pfxspST?: null;
  pfxspCUO: number;
  pfxspCV?: null;
  // Pitching-specific Statcast metrics for swing analysis
  'scH-Swing%': number;
  'scH-Contact%': number;
  'scH-Zone%': number;
  'scS-Swing%': number;
  'scS-Contact%': number;
  'scS-Zone%': number;
  'scC-Swing%': number;
  'scC-Contact%': number;
  'scC-Zone%': number;
  'scW-Swing%': number;
  'scW-Contact%': number;
  'scW-Zone%': number;
  'scSI-Swing%': number;
  'scSI-Contact%': number;
  'scSI-Zone%': number;
  'scSO-Swing%': number;
  'scSO-Contact%': number;
  'scSO-Zone%': number;
  'scO-Swing%': number;
  'scO-Contact%': number;
  'scO-Zone%': number;
  'scZ-Swing%': number;
  'scZ-Contact%': number;
  // Pitching-specific PITCHInfo (optional fields)
  'piCS%'?: null;
  'piFS%'?: null;
  'piKN%'?: null;
  'piSB%'?: null;
  'piXX%'?: null;
  pivCS?: null;
  pivFS?: null;
  pivKN?: null;
  pivSB?: null;
  pivXX?: null;
  'piCS-X'?: null;
  'piFS-X'?: null;
  'piKN-X'?: null;
  'piSB-X'?: null;
  'piXX-X'?: null;
  'piCS-Z'?: null;
  'piFS-Z'?: null;
  'piKN-Z'?: null;
  'piSB-Z'?: null;
  'piXX-Z'?: null;
  piwCS?: null;
  piwFS?: null;
  piwKN?: null;
  piwSB?: null;
  piwXX?: null;
  'piwCS/C'?: null;
  'piwFS/C'?: null;
  'piwKN/C'?: null;
  'piwSB/C'?: null;
  'piwXX/C'?: null;

  // Pitching innings pitched
  TIP: number;

  // Pitching position (string instead of number)
  position: string;

  // Pitching-specific Statcast
  EV90: number;
}
