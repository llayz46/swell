import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export type TeamRoleName = 'team-lead' | 'team-member' | null;

/**
 * Hook to get the user's workspace role and related permissions
 *
 * New architecture (Option A):
 * - workspace-admin (Spatie) → Global admin, can do everything
 * - team-lead (pivot) → Lead of a specific team
 * - team-member (pivot) → Member of a specific team
 *
 * @param teamId - Optional team ID to check role for. If not provided, uses current team from store.
 */
export function useWorkspaceRole(teamId?: number) {
    const { auth } = usePage<SharedData>().props;
    const storeTeam = useWorkspaceIssuesStore((state) => state.team);

    return useMemo(() => {
        const user = auth.user;

        if (!user) {
            return {
                isAdmin: false,
                isLead: false,
                isMember: false,
                hasWorkspaceAccess: false,
                teamRole: null as TeamRoleName,
            };
        }

        // Check if user is workspace admin (Spatie role)
        const isAdmin = user.roles?.some((r) => (typeof r === 'string' ? r : r.name) === 'workspace-admin') ?? false;

        // Get current team ID (from parameter or store)
        const currentTeamId = teamId ?? storeTeam?.id;

        // Find user's role in the current team
        const currentTeam = auth.teams?.find((t) => t.id === currentTeamId);
        const teamRole = (currentTeam?.role as TeamRoleName) ?? null;

        // Compute permissions
        const isLeadInCurrentTeam = teamRole === 'team-lead';
        const isLead = isAdmin || isLeadInCurrentTeam;
        const isMember = isAdmin || !!currentTeam;
        const hasWorkspaceAccess = auth.isWorkspaceUser;

        return {
            isAdmin,
            isLead,
            isMember,
            hasWorkspaceAccess,
            teamRole,
        };
    }, [auth.user, auth.teams, auth.isWorkspaceUser, teamId, storeTeam?.id]);
}
