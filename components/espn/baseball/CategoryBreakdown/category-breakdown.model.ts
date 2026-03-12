import { FangraphsBatterStatsEntity } from '@/lib/models/fangraphs/player-stats.model';

export interface CategoryOption {
  key: keyof FangraphsBatterStatsEntity;
  label: string;
  color: string;
  description: string;
  isRate: boolean;
}
