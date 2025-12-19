import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseballImageHelper } from "@/lib/helpers";
import { BaseballLeague } from "@/lib/models/baseball";

interface LeagueHeaderProps {
    isLoading: boolean;
    league: BaseballLeague | null;
}

export default function LeagueHeader({ isLoading, league }: LeagueHeaderProps) {

    if (!league && !isLoading) return null;

    const leagueName = league?.name || null;

    const year = league?.seasonId ? `${league.seasonId} Season` : null;

    const leagueType = league?.scoringType || null;

    const teamCount = league?.size ? `${league.size} Teams` : null;

    const scoringPeriodId = league?.scoringPeriodId
        ? `Day ${league.scoringPeriodId}`
        : 'Preseason';

    return (
        <Card className="mb-4">
            <CardContent>
                <div className="flex flex-col md:flex-row xs:items-center">
                    {isLoading ? (
                        <Skeleton />
                    ) : (

                        <div style={{ width: 88, height: 88 }} className="relative rounded-md overflow-hidden bg-gray-200"                        >
                            <img src={BaseballImageHelper.fantasySportLeagueImage} alt={leagueName ?? '-'} className="w-full h-full object-cover" />
                        </div>
                    )}


                    <div className="flex flex-col mt-4 md:ml-4">
                        {!isLoading && (<>
                            <h1 className="text-xl font-bold">{leagueName}</h1>
                            <p className="text-sm text-gray-600">
                                {[year ?? '-', leagueType ?? '-', teamCount ?? '-', scoringPeriodId ?? '-']
                                    .filter(Boolean)
                                    .join(' | ')}
                            </p>
                        </>)}
                    </div>
                    <div className="flex flex-col mt-4 md:ml-4">
                        <a href={`https://fantasy.espn.com/baseball/league?leagueId=${league?.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            <Button variant="outline">View League Settings on ESPN</Button>
                        </a>
                    </div>

                </div>

            </CardContent>
        </Card>

    );
}