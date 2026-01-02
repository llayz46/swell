import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceTeamsStore } from '@/stores/workspace-teams-store';
import type { Team } from '@/types/workspace';
import { ArrowUpDown, CheckIcon, ChevronRight, ListFilter, Shield, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';

type FilterType = 'membership' | 'sort' | 'identifiers';

const MEMBERSHIPS: Array<{ value: 'joined' | 'not-joined'; label: string }> = [
    { value: 'joined', label: 'Membre' },
    { value: 'not-joined', label: 'Non Membre' },
];

export function Filter({ teams }: { teams: Team[] }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<FilterType | null>(null);

    const {
        filters,
        sort,
        toggleMembershipFilter,
        toggleIdentifierFilter,
        clearFilters,
        getActiveFiltersCount,
        setSort,
    } = useWorkspaceTeamsStore();

    const identifiers: Team['identifier'][] = useMemo(() => {
        return teams.map((team) => team.identifier);
    }, [teams]);

    const getMembershipCount = (membership: 'joined' | 'not-joined') => {
        return teams.filter((team) => {
            const isJoined = Boolean(team.joined);
            return membership === 'joined' ? isJoined : !isJoined;
        }).length;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="xs" variant="ghost" className="relative">
                    <ListFilter className="mr-1 size-4" />
                    Filtrer
                    {getActiveFiltersCount() > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {getActiveFiltersCount()}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0" align="start">
                {active === null ? (
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={() => setActive('membership')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Shield className="size-4 text-muted-foreground" />
                                        Adhésion
                                    </span>
                                    <div className="flex items-center">
                                        {filters.membership.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.membership.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                                <CommandItem onSelect={() => setActive('identifiers')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Tag className="size-4 text-muted-foreground" />
                                        Identifiants
                                    </span>
                                    <div className="flex items-center">
                                        {filters.identifiers.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.identifiers.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                                <CommandItem onSelect={() => setActive('sort')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="size-4 text-muted-foreground" />
                                        Trier par
                                    </span>
                                    <ChevronRight className="size-4" />
                                </CommandItem>
                            </CommandGroup>
                            {getActiveFiltersCount() > 0 && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => clearFilters()}
                                            className="text-destructive focus-visible:ring-destructive/20 data-[selected=true]:bg-destructive/15 data-[selected=true]:text-destructive! dark:focus-visible:ring-destructive/40"
                                        >
                                            Effacer tous les filtres
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                ) : active === 'membership' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActive(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Adhésion</span>
                        </div>
                        <CommandList>
                            <CommandGroup>
                                {MEMBERSHIPS.map((membership) => (
                                    <CommandItem
                                        key={membership.value}
                                        value={membership.value}
                                        onSelect={() => toggleMembershipFilter(membership.value)}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{membership.label}</span>
                                        <div className="flex items-center gap-2">
                                            {filters.membership.includes(membership.value) && <CheckIcon size={16} className="ml-auto" />}
                                            <span className="text-xs text-muted-foreground">{getMembershipCount(membership.value)}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : active === 'identifiers' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActive(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Identifiants</span>
                        </div>
                        <CommandList>
                            <CommandGroup>
                                {identifiers.map((identifier) => (
                                    <CommandItem
                                        key={identifier}
                                        value={identifier}
                                        onSelect={() => toggleIdentifierFilter(identifier)}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{identifier}</span>
                                        {filters.identifiers.includes(identifier) && <CheckIcon size={16} />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : active === 'sort' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActive(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Trier par</span>
                        </div>
                        <CommandList>
                            <CommandGroup heading="Nom">
                                <CommandItem onSelect={() => setSort('name-asc')} className="flex items-center justify-between">
                                    A → Z{sort === 'name-asc' && <CheckIcon size={16} />}
                                </CommandItem>
                                <CommandItem onSelect={() => setSort('name-desc')} className="flex items-center justify-between">
                                    Z → A{sort === 'name-desc' && <CheckIcon size={16} />}
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Membres">
                                <CommandItem onSelect={() => setSort('members-asc')} className="flex items-center justify-between">
                                    Croissant
                                    {sort === 'members-asc' && <CheckIcon size={16} />}
                                </CommandItem>
                                <CommandItem onSelect={() => setSort('members-desc')} className="flex items-center justify-between">
                                    Décroissant
                                    {sort === 'members-desc' && <CheckIcon size={16} />}
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
