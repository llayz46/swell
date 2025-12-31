import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export type WorkspaceRoleName = 'workspace-admin' | 'workspace-lead' | 'workspace-member' | null;

/**
 * Hook to get the user's workspace role and related permissions
 * Automatically handles role hierarchy: workspace-admin > workspace-lead > workspace-member
 */
export function useWorkspaceRole() {
    const { auth } = usePage<SharedData>().props;

    return useMemo(() => {
        const user = auth.user;

        if (!user?.roles) {
            return {
                role: null as WorkspaceRoleName,
                isAdmin: false,
                isLead: false,
                isMember: false,
                hasWorkspaceAccess: false,
            };
        }

        // Extract workspace roles from user roles
        const workspaceRoles = user.roles
            .map((r) => (typeof r === 'string' ? r : r.name))
            .filter((name) => name.startsWith('workspace-'));

        // Determine the highest role based on hierarchy
        let role: WorkspaceRoleName = null;
        if (workspaceRoles.includes('workspace-admin')) {
            role = 'workspace-admin';
        } else if (workspaceRoles.includes('workspace-lead')) {
            role = 'workspace-lead';
        } else if (workspaceRoles.includes('workspace-member')) {
            role = 'workspace-member';
        }

        // Compute permissions based on role hierarchy
        const isAdmin = role === 'workspace-admin';
        const isLead = isAdmin || role === 'workspace-lead';
        const isMember = isLead || role === 'workspace-member';
        const hasWorkspaceAccess = role !== null;

        return {
            role,
            isAdmin,
            isLead,
            isMember,
            hasWorkspaceAccess,
        };
    }, [auth.user]);
}
