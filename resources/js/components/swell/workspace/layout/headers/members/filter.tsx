import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import type { TeamMember, WorkspaceMember } from '@/types/workspace';
import { ArrowUpDown, CheckIcon, ChevronRight, ListFilter, Shield } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'role' | 'sort';

const ROLES: Array<{ value: 'workspace-admin' | 'team-lead' | 'team-member'; label: string }> = [
    { value: 'workspace-admin', label: 'Admin' },
    { value: 'team-lead', label: 'Lead' },
    { value: 'team-member', label: 'Membre' },
];

export function Filter({ members }: { members: TeamMember[] | WorkspaceMember[] }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<FilterType | null>(null);

    const { filters, sort, toggleFilter, clearFilters, getActiveFiltersCount, setSort, filterByRole } = useWorkspaceMembersStore();

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
                                <CommandItem onSelect={() => setActive('role')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Shield className="size-4 text-muted-foreground" />
                                        Rôle
                                    </span>
                                    <div className="flex items-center">
                                        {filters.role.length > 0 && <span className="mr-1 text-xs text-muted-foreground">{filters.role.length}</span>}
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
                ) : active === 'role' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActive(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Rôle</span>
                        </div>
                        <CommandList>
                            <CommandGroup>
                                {ROLES.map((role) => (
                                    <CommandItem
                                        key={role.value}
                                        value={role.value}
                                        onSelect={() => toggleFilter('role', role.value)}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{role.label}</span>
                                        <div className="flex items-center gap-2">
                                            {filters.role.includes(role.value) && <CheckIcon size={16} className="ml-auto" />}
                                            <span className="text-xs text-muted-foreground">{filterByRole(role.value).length}</span>
                                        </div>
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
                            <CommandGroup heading="Date de rejoindre">
                                <CommandItem onSelect={() => setSort('joined-asc')} className="flex items-center justify-between">
                                    Plus ancien → Plus récent
                                    {sort === 'joined-asc' && <CheckIcon size={16} />}
                                </CommandItem>
                                <CommandItem onSelect={() => setSort('joined-desc')} className="flex items-center justify-between">
                                    Plus récent → Plus ancien
                                    {sort === 'joined-desc' && <CheckIcon size={16} />}
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
