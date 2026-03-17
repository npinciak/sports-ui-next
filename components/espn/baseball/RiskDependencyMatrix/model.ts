import { BatterWithFangraphsStats } from '@/lib/models/baseball';

export interface BatterWithRegressionMetrics extends BatterWithFangraphsStats {
  divScore: number;
  depScore: number;
  action: {
    label: string;
    color: string;
    bg: string;
    priority: number;
  };
}
