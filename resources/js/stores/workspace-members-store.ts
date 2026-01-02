import type { Team, TeamMember, WorkspaceMember } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand';

type InvitableTeam = {
    id: number;
    identifier: string;
    name: string;
    icon?: string;
    color: string;
};

type MemberRole = 'workspace-admin' | 'team-lead' | 'team-member';
type SortOption = 'name-asc' | 'name-desc' | 'joined-asc' | 'joined-desc' | null;

type Filters = {
    role: MemberRole[];
};

type WorkspaceMembersStore = {
    members: WorkspaceMember[] | TeamMember[];
    workspaceMembers: WorkspaceMember[]; // Always invite WorkspaceMember
    invitableTeams: InvitableTeam[];
    roles: string[];
    inviteMemberDialogOpen: boolean;
    removingMembers: Set<number>;
    promotingMembers: Set<number>;
    demotingMembers: Set<number>;

    openInviteMemberDialog: (options?: { teamId?: number }) => void;
    closeInviteMemberDialog: () => void;

    inviteMemberTeamId: number | null;

    // Actions with server calls
    performRemoveMember: (team: Team, member: TeamMember) => void;
    performPromoteMember: (team: Team, member: TeamMember) => void;
    performDemoteMember: (team: Team, member: TeamMember) => void;

    filters: Filters;
    sort: SortOption;
    setMembers: (members: WorkspaceMember[] | TeamMember[]) => void;
    setWorkspaceMembers: (members: WorkspaceMember[]) => void;
    toggleFilter: (filterType: keyof Filters, value: MemberRole) => void;
    clearFilters: () => void;
    getActiveFiltersCount: () => number;
    setSort: (sort: SortOption) => void;
    filterByRole: (role: MemberRole) => WorkspaceMember[] | TeamMember[];
    getFilteredAndSortedMembers: () => WorkspaceMember[] | TeamMember[];
};

export const useWorkspaceMembersStore = create<WorkspaceMembersStore>((set, get) => ({
    members: [],
    workspaceMembers: [],
    invitableTeams: [],
    roles: ['team-lead', 'team-member'],
    inviteMemberDialogOpen: false,
    inviteMemberTeamId: null,
    removingMembers: new Set<number>(),
    promotingMembers: new Set<number>(),
    demotingMembers: new Set<number>(),
    filters: {
        role: [],
    },
    sort: null,

    openInviteMemberDialog: (options) => {
        set({
            inviteMemberDialogOpen: true,
            inviteMemberTeamId: options?.teamId || null,
        });
    },
    closeInviteMemberDialog: () => {
        set({
            inviteMemberDialogOpen: false,
        });
    },

    // Actions
    performRemoveMember: (team, member) => {
        const { removingMembers } = get();

        set({ removingMembers: new Set(removingMembers).add(member.id) });

        router.delete(route('workspace.teams.remove-member', { team: team.id, user: member.id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                const { removingMembers } = get();
                const newSet = new Set(removingMembers);
                newSet.delete(member.id);
                set({ removingMembers: newSet });

                toast.success(`${member.name} a été retiré de l'équipe avec succès`);
            },
            onError: (errors) => {
                const { removingMembers } = get();
                const newSet = new Set(removingMembers);
                newSet.delete(member.id);
                set({ removingMembers: newSet });

                const errorMessage = (errors as Record<string, string>).member || 'Erreur lors du retrait du membre';
                toast.error(errorMessage);
            },
        });
    },

    performPromoteMember: (team, member) => {
        const { promotingMembers } = get();

        set({ promotingMembers: new Set(promotingMembers).add(member.id) });

        router.post(route('workspace.teams.promote-member', { team: team.id, user: member.id }), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                const { promotingMembers } = get();
                const newSet = new Set(promotingMembers);
                newSet.delete(member.id);
                set({ promotingMembers: newSet });

                toast.success(`${member.name} a été promu lead avec succès`);
            },
            onError: (errors) => {
                const { promotingMembers } = get();
                const newSet = new Set(promotingMembers);
                newSet.delete(member.id);
                set({ promotingMembers: newSet });

                const errorMessage = (errors as Record<string, string>).member || 'Erreur lors de la promotion du membre';
                toast.error(errorMessage);
            },
        });
    },

    performDemoteMember: (team, member) => {
        const { demotingMembers } = get();

        set({ demotingMembers: new Set(demotingMembers).add(member.id) });

        router.post(route('workspace.teams.demote-member', { team: team.id, user: member.id }), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                const { demotingMembers } = get();
                const newSet = new Set(demotingMembers);
                newSet.delete(member.id);
                set({ demotingMembers: newSet });

                toast.success(`${member.name} a été rétrogradé membre avec succès`);
            },
            onError: (errors) => {
                const { demotingMembers } = get();
                const newSet = new Set(demotingMembers);
                newSet.delete(member.id);
                set({ demotingMembers: newSet });

                const errorMessage = (errors as Record<string, string>).member || 'Erreur lors de la rétrogradation du membre';
                toast.error(errorMessage);
            },
        });
    },

    setMembers: (members) => set({ members }),
    setWorkspaceMembers: (workspaceMembers) => set({ workspaceMembers }),

    toggleFilter: (filterType, value) =>
        set((state) => {
            const currentFilters = state.filters[filterType];
            const newFilters = currentFilters.includes(value) ? currentFilters.filter((v) => v !== value) : [...currentFilters, value];

            return {
                filters: {
                    ...state.filters,
                    [filterType]: newFilters,
                },
            };
        }),

    clearFilters: () =>
        set({
            filters: {
                role: [],
            },
        }),

    getActiveFiltersCount: () => {
        const { filters } = get();
        return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
    },

    setSort: (sort) => set({ sort }),

    filterByRole: (role) => {
        const { members } = get();
        return members.filter((member) => {
            const memberRole = 'workspaceRole' in member ? member.workspaceRole : member.role;
            return memberRole === role;
        }) as WorkspaceMember[] | TeamMember[];
    },

    getFilteredAndSortedMembers: () => {
        const { members, filters, sort } = get();

        let filteredMembers = members;

        if (filters.role.length > 0) {
            filteredMembers = filteredMembers.filter((member) => {
                const memberRole = 'workspaceRole' in member ? member.workspaceRole : member.role;
                return filters.role.includes(memberRole);
            }) as WorkspaceMember[] | TeamMember[];
        }

        if (sort) {
            filteredMembers = [...filteredMembers].sort((a, b) => {
                switch (sort) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'joined-asc': {
                        const dateA = 'joined_at' in a ? a.joined_at : a.created_at;
                        const dateB = 'joined_at' in b ? b.joined_at : b.created_at;
                        return new Date(dateA).getTime() - new Date(dateB).getTime();
                    }
                    case 'joined-desc': {
                        const dateA = 'joined_at' in a ? a.joined_at : a.created_at;
                        const dateB = 'joined_at' in b ? b.joined_at : b.created_at;
                        return new Date(dateB).getTime() - new Date(dateA).getTime();
                    }
                    default:
                        return 0;
                }
            }) as WorkspaceMember[] | TeamMember[];
        }

        return filteredMembers;
    },
}))