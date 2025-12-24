import { StatusIcon } from '@/components/swell/workspace/icons';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { IssueStatus } from '@/types/workspace';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface StatusSelectorProps {
    status: IssueStatus;
    issueId: number;
}

export function StatusSelector({ status, issueId }: StatusSelectorProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(status.slug);

    const { statuses, filterByStatus, updatingIssues, performUpdateStatus } = useWorkspaceIssuesStore(
        useShallow((state) => ({
            statuses: state.statuses,
            filterByStatus: state.filterByStatus,
            updatingIssues: state.updatingIssues,
            performUpdateStatus: state.performUpdateStatus,
        })),
    );

    const isUpdating = updatingIssues.has(issueId);

    useEffect(() => {
        setValue(status.slug);
    }, [status.slug]);

    const handleStatusChange = (statusSlug: string) => {
        setValue(statusSlug);
        setOpen(false);

        performUpdateStatus(issueId, statusSlug, status);
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
                        disabled={isUpdating}
                    >
                        {(() => {
                            const selectedItem = statuses.find((item) => item.slug === value);
                            if (selectedItem) {
                                return <StatusIcon iconType={selectedItem.icon_type} color={selectedItem.color} size={14} />;
                            }
                            return null;
                        })()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Définir le statut..." />
                        <CommandList>
                            <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.slug}
                                        keywords={[item.name, item.slug]}
                                        onSelect={handleStatusChange}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <StatusIcon iconType={item.icon_type} color={item.color} size={14} />
                                            {item.name}
                                        </div>
                                        {value === item.slug && <CheckIcon size={16} className="ml-auto" />}
                                        {filterByStatus && (
                                            <span className="text-xs text-muted-foreground">{filterByStatus(item.id).length}</span>
                                        )}
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
