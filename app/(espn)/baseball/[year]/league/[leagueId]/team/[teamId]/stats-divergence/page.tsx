import ArsenalRegressionMatrix from '@/components/espn/baseball/ArsenalQuality/ArsenalQuality';
import CategoryContributionBreakdown from '@/components/espn/baseball/CategoryBreakdown/CategoryBreakdown';
import RiskDependencyMatrix from '@/components/espn/baseball/RiskDependencyMatrix/RiskDependencyMatrix';
import XStatsDivergencePanel from '@/components/espn/baseball/StatsDivergence/StatsDivergence';

interface PageProps {
  params: Promise<{ year: string; leagueId: string; teamId: string }>;
}

export default async function Page({ params }: PageProps) {
  return (
    <>
      <XStatsDivergencePanel />
      <CategoryContributionBreakdown />
      <RiskDependencyMatrix />
      <ArsenalRegressionMatrix />
    </>
  );
}
