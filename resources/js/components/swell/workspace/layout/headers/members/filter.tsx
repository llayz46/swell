import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TeamMember } from '@/types/workspace';
import { ArrowUpDown, ChevronRight, ListFilter, Shield } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'role' | 'sort';

const ROLES: Array<'Guest' | 'Member' | 'Admin'> = ['Guest', 'Member', 'Admin'];

export function Filter({ members }: { members: TeamMember[] }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<FilterType | null>(null);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="xs" variant="ghost" className="relative">
                    <ListFilter className="mr-1 size-4" />
                    Filtrer
                    {/*{getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full size-4 flex items-center justify-center">
                     {getActiveFiltersCount()}
                  </span>
               )}*/}
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
                                        Statut
                                    </span>
                                    <div className="flex items-center">
                                        {/*{filters.role.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.role.length}
                                 </span>
                              )}*/}
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
                            {/*{getActiveFiltersCount() > 0 && (
                        <>
                           <CommandSeparator />
                           <CommandGroup>
                              <CommandItem
                                 onSelect={() => clearFilters()}
                                 className="cursor-pointer"
                              >
                                 Clear all filters
                              </CommandItem>
                           </CommandGroup>
                        </>
                     )}*/}
                        </CommandList>
                    </Command>
                ) : active === 'role' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActive(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Statut</span>
                        </div>
                        <CommandList>
                            <CommandGroup>
                                {ROLES.map((role) => (
                                    <CommandItem
                                        key={role}
                                        value={role}
                                        // onSelect={() => toggleFilter('role', role)}
                                        className="flex items-center justify-between"
                                    >
                                        {role}
                                        {/*{filters.role.includes(role) && <CheckIcon size={16} />}*/}
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
                        {/*<CommandList>
                     <CommandGroup heading="Name">
                        <CommandItem
                           onSelect={() => setSort('name-asc')}
                           className="flex items-center justify-between"
                        >
                           A → Z{sort === 'name-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('name-desc')}
                           className="flex items-center justify-between"
                        >
                           Z → A{sort === 'name-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Joined">
                        <CommandItem
                           onSelect={() => setSort('joined-asc')}
                           className="flex items-center justify-between"
                        >
                           Oldest to Newest
                           {sort === 'joined-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('joined-desc')}
                           className="flex items-center justify-between"
                        >
                           Newest to Oldest
                           {sort === 'joined-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Teams">
                        <CommandItem
                           onSelect={() => setSort('teams-asc')}
                           className="flex items-center justify-between"
                        >
                           Lowest to Highest
                           {sort === 'teams-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('teams-desc')}
                           className="flex items-center justify-between"
                        >
                           Highest to Lowest
                           {sort === 'teams-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                  </CommandList>*/}
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
