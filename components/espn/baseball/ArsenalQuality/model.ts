import { PitcherWithFangraphsStats } from '@/lib/models/baseball';

export interface PitcherWithRegressionMetrics extends PitcherWithFangraphsStats {
  stuffScore: number | null;
  regScore: number;
  bestPitchVal?: number;
  arsenal: PitchArsenal[];
  bestPitch?: {
    label: string;
    color: string;
    runValue: number | null;
  } | null;
  quadrant?: {
    label: string;
    color: string;
    desc: string;
  };
}

export interface PitchArsenal {
  pct: number | null;
  runValue: number | null;
  velocity: number | null;
  armAngle: number | null;
  spin: number | null;
  pctKey: string;
  wKey: string;
  vKey: string;
  aaKey: string;
  spKey: string;
  label: string;
  name: string;
  color: string;
}
