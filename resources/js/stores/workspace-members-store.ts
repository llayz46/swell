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
        // const url = new URL(window.location.href);
        // if (!url.pathname.endsWith('/new')) {
        //     url.pathname = url.pathname + '/new';
        // }
        // if (options?.statusId !== undefined) {
        //     url.searchParams.set('status', options.statusId.toString());
        // }
        // window.history.pushState({}, '', url.toString());

        set({
            inviteMemberDialogOpen: true,
            inviteMemberTeamId: options?.teamId || null,
        });
    },
    closeInviteMemberDialog: () => {
        // const url = new URL(window.location.href);
        // url.pathname = url.pathname.replace('/new', '');
        // url.searchParams.delete('status');
        // window.history.replaceState({}, '', url.toString());

        set({
            inviteMemberDialogOpen: false,
        });
    },
}))