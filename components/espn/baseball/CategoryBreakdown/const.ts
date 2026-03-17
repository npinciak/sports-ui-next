import { CategoryOption } from './category-breakdown.model';

export const CATEGORIES: CategoryOption[] = [
  { key: 'HR', label: 'HR', color: '#e85d26', description: 'Home Runs', isRate: false },
  { key: 'R', label: 'R', color: '#d4a017', description: 'Runs', isRate: false },
  { key: 'RBI', label: 'RBI', color: '#4ade80', description: 'RBI', isRate: false },
  { key: 'SB', label: 'SB', color: '#38bdf8', description: 'Stolen Bases', isRate: false },
  { key: 'AVG', label: 'AVG', color: '#c084fc', description: 'Batting Average', isRate: true },
];

export const PLAYER_COLORS = ['#e85d26', '#d4a017', '#4ade80', '#38bdf8', '#c084fc', '#fb923c', '#facc15', '#86efac', '#7dd3fc', '#d8b4fe'];
