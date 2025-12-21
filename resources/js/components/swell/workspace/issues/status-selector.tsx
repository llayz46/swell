import { StatusIcon } from '@/components/swell/workspace/icons';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { IssueStatus } from '@/types/workspace';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface StatusSelectorProps {
    status: IssueStatus;
    issueId: string;
}

export function StatusSelector({ status, issueId }: StatusSelectorProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(status.id);

    const statuses = useWorkspaceIssuesStore((state) => state.statuses || []);
    const filterByStatus = useWorkspaceIssuesStore((state) => state.filterByStatus);

    useEffect(() => {
        setValue(status.id);
    }, [status.id]);

    const handleStatusChange = (statusId: string) => {
        setValue(statusId);
        setOpen(false);

        // if (issueId) {
        //    const newStatus = allStatus.find((s) => s.id === statusId);
        //    if (newStatus) {
        //       updateIssueStatus(issueId, newStatus);
        //    }
        // }
    };

    return (
        <div className="*:not-first:mt-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        className="flex size-7 items-center justify-center"
                        size="icon"
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                    >
                        <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Définir le statut..." />
                        <CommandList>
                            <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.id}
                                        value={status.id}
                                        onSelect={handleStatusChange}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                                            {status.name}
                                        </div>
                                        {value === status.id && <CheckIcon size={16} className="ml-auto" />}
                                        <span className="text-xs text-muted-foreground">{filterByStatus(status.id).length}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
