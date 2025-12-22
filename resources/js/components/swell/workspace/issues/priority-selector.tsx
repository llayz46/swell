import { PriorityIcon } from '@/components/swell/workspace/icons';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import type { IssuePriority } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { toast } from "sonner";

interface PrioritySelectorProps {
    priority: IssuePriority;
    issueId?: number;
}

export function PrioritySelector({ priority, issueId }: PrioritySelectorProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(priority.slug);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const { priorities, filterByPriority, updateIssuePriority } = useWorkspaceIssuesStore();

    useEffect(() => {
        setValue(priority.slug);
    }, [priority.slug]);

    const handlePriorityChange = (prioritySlug: string) => {
        setValue(prioritySlug);
        setOpen(false);

        if (!issueId) return;

        const newPriority = priorities.find((p) => p.slug === prioritySlug);
        if (!newPriority) return;

        if (newPriority.slug === priority.slug) return;

        updateIssuePriority(issueId, newPriority);

        setIsUpdating(true);

        router.patch(
            route('workspace.issues.update-priority', { issue: issueId }),
            { priority_id: newPriority.id },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (errors) => {
                    updateIssuePriority(issueId, priority);
                    setIsUpdating(false);
                
                    toast.error(errors.priority_id);
                },
                onSuccess: () => {
                    setIsUpdating(false);
                    
                    toast.success('Priorité mise à jour avec succès');
                }
            }
        );
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
                            const selectedItem = priorities.find((item) => item.slug === value);
                            if (selectedItem) {
                                return (
                                    <PriorityIcon
                                        iconType={selectedItem.icon_type}
                                        width={16}
                                        height={16}
                                        className="text-muted-foreground"
                                    />
                                );
                            }
                            return null;
                        })()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Définir la priorité..." />
                        <CommandList>
                            <CommandEmpty>Aucune priorité trouvée.</CommandEmpty>
                            <CommandGroup>
                                {priorities.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.slug}
                                        keywords={[item.name, item.slug]}
                                        onSelect={handlePriorityChange}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <PriorityIcon iconType={item.icon_type} color={item.color} width={14} height={14} className="shrink-0" />
                                            {item.name}
                                        </div>
                                        {value === item.slug && <CheckIcon size={16} className="ml-auto" />}
                                        {filterByPriority && (
                                            <span className="text-xs text-muted-foreground">{filterByPriority(item.slug).length}</span>
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
