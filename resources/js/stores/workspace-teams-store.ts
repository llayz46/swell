import type { Team } from '@/types/workspace';
import { create } from 'zustand';

type MembershipFilter = 'joined' | 'not-joined';
type SortOption = 'name-asc' | 'name-desc' | 'members-asc' | 'members-desc' | null;

type Filters = {
    membership: MembershipFilter[];
    identifiers: string[];
};

type WorkspaceTeamsStore = {
    teams: Team[];
    filters: Filters;
    sort: SortOption;

    setTeams: (teams: Team[]) => void;
    toggleMembershipFilter: (value: MembershipFilter) => void;
    toggleIdentifierFilter: (value: string) => void;
    clearFilters: () => void;
    getActiveFiltersCount: () => number;
    setSort: (sort: SortOption) => void;
    getFilteredAndSortedTeams: () => Team[];
};

export const useWorkspaceTeamsStore = create<WorkspaceTeamsStore>((set, get) => ({
    teams: [],
    filters: {
        membership: [],
        identifiers: [],
    },
    sort: null,

    setTeams: (teams) => set({ teams }),

    toggleMembershipFilter: (value) =>
        set((state) => {
            const currentFilters = state.filters.membership;
            const newFilters = currentFilters.includes(value) ? currentFilters.filter((v) => v !== value) : [...currentFilters, value];

            return {
                filters: {
                    ...state.filters,
                    membership: newFilters,
                },
            };
        }),

    toggleIdentifierFilter: (value) =>
        set((state) => {
            const currentFilters = state.filters.identifiers;
            const newFilters = currentFilters.includes(value) ? currentFilters.filter((v) => v !== value) : [...currentFilters, value];

            return {
                filters: {
                    ...state.filters,
                    identifiers: newFilters,
                },
            };
        }),

    clearFilters: () =>
        set({
            filters: {
                membership: [],
                identifiers: [],
            },
        }),

    getActiveFiltersCount: () => {
        const { filters } = get();
        return filters.membership.length + filters.identifiers.length;
    },

    setSort: (sort) => set({ sort }),

    getFilteredAndSortedTeams: () => {
        const { teams, filters, sort } = get();

        let filteredTeams = teams;

        if (filters.membership.length > 0) {
            filteredTeams = filteredTeams.filter((team) => {
                const isJoined = Boolean(team.joined);

                if (filters.membership.includes('joined') && filters.membership.includes('not-joined')) {
                    return true;
                }

                if (filters.membership.includes('joined')) {
                    return isJoined;
                }

                if (filters.membership.includes('not-joined')) {
                    return !isJoined;
                }

                return false;
            });
        }

        if (filters.identifiers.length > 0) {
            filteredTeams = filteredTeams.filter((team) => filters.identifiers.includes(team.identifier));
        }

        if (sort) {
            filteredTeams = [...filteredTeams].sort((a, b) => {
                switch (sort) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'members-asc':
                        return (a.membersCount ?? 0) - (b.membersCount ?? 0);
                    case 'members-desc':
                        return (b.membersCount ?? 0) - (a.membersCount ?? 0);
                    default:
                        return 0;
                }
            });
        }

        return filteredTeams;
    },
}));
