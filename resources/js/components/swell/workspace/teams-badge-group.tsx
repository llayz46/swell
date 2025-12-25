import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Team } from '@/types/workspace';
import { ContactRound } from 'lucide-react';

interface TeamsBadgeGroupProps {
    teams: Team[];
    maxDisplay?: number;
}

export function TeamsBadgeGroup({ teams, maxDisplay = 3 }: TeamsBadgeGroupProps) {
    const displayedTeams = teams.slice(0, maxDisplay);
    const remainingCount = teams.length - displayedTeams.length;

    if (teams.length === 0) {
        return <span className="text-xs font-medium text-muted-foreground">Aucune équipe</span>;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                        <ContactRound className="mr-1 size-4 shrink-0 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                            {displayedTeams.map((team, index) => (
                                <span key={team.id} className="text-xs font-medium">
                                    {team.identifier}
                                    {index < displayedTeams.length - 1 && ','}
                                </span>
                            ))}
                        </div>
                        {remainingCount > 0 && <span className="text-xs text-muted-foreground">+{remainingCount}</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-md border bg-background p-2 text-muted-foreground **:data-[slot=tooltip-arrow]:bg-background **:data-[slot=tooltip-arrow]:fill-background">
                    <div className="flex flex-col gap-1">
                        {teams.map((team) => (
                            <div key={team.id} className="flex items-center gap-2 text-xs">
                                <div className="inline-flex size-6 shrink-0 items-center justify-center rounded bg-muted/50">
                                    <div className="text-sm">{team.icon}</div>
                                </div>
                                <span className="font-medium">{team.name}</span>
                            </div>
                        ))}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
