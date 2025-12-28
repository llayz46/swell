import type { WorkspaceMember } from '@/types/workspace';
import { create } from 'zustand';

type WorkspaceMembersStore = {
    members: WorkspaceMember[];
    roles: string[];
    inviteMemberDialogOpen: boolean;
    
    openInviteMemberDialog: (options?: { teamId?: number; }) => void;
    closeInviteMemberDialog: () => void;
    
    inviteMemberTeamId: number | null;
}

export const useWorkspaceMembersStore = create<WorkspaceMembersStore>((set, get) => ({
    members: [],
    roles: ['team-lead', 'team-member'],
    inviteMemberDialogOpen: false,
    inviteMemberTeamId: null,
    
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
}))