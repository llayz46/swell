import type { Team, TeamMember, WorkspaceMember } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand';

type WorkspaceMembersStore = {
    members: WorkspaceMember[];
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
};

export const useWorkspaceMembersStore = create<WorkspaceMembersStore>((set, get) => ({
    members: [],
    roles: ['team-lead', 'team-member'],
    inviteMemberDialogOpen: false,
    inviteMemberTeamId: null,
    removingMembers: new Set<number>(),
    promotingMembers: new Set<number>(),
    demotingMembers: new Set<number>(),

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
}))