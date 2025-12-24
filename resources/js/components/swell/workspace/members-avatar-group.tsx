import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TeamMember } from '@/types/workspace';
import { getStorageUrl } from '@/utils/format-storage-url';
import { Star } from 'lucide-react';

interface MembersAvatarGroupProps {
    members: TeamMember[];
    maxDisplay?: number;
}

export function MembersAvatarGroup({ members, maxDisplay = 3 }: MembersAvatarGroupProps) {
    const displayedMembers = members.slice(0, maxDisplay);
    const remainingCount = members.length - displayedMembers.length;

    if (members.length === 0) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex -space-x-2">
                        {displayedMembers.map((member, index) => (
                            <Avatar key={index} className="size-6 border-2 border-background dark:border-sidebar">
                                <AvatarImage src={getStorageUrl(member.avatarUrl)} alt={member.name} />
                                <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                        {remainingCount > 0 && (
                            <div className="z-5 flex size-6 items-center justify-center rounded-full border-2 border-background bg-sidebar text-xs dark:border-sidebar">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-md border bg-background p-2 text-muted-foreground **:data-[slot=tooltip-arrow]:bg-background **:data-[slot=tooltip-arrow]:fill-background">
                    <div className="flex flex-col gap-1">
                        {members.map((member, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <Avatar className="size-5">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.name}</span>
                                <span className="mt-px text-xs text-muted-foreground">- {member.email}</span>
                                {member.role === 'lead' && <Star className="size-3 fill-yellow-500 text-yellow-500" />}
                            </div>
                        ))}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
