/**
 * Format workspace/team role for display
 *
 * Option A architecture:
 * - workspace-admin (Spatie) → Global admin
 * - team-lead (pivot) → Lead of a specific team
 * - team-member (pivot) → Member of a specific team
 *
 * @param role - Can be a role string, role object, or array of role strings
 */
export function formatWorkspaceRole(role: string | { name: string } | string[] | { name: string }[]): string {
    // Handle array of roles - return the first workspace/team role
    if (Array.isArray(role)) {
        const workspaceRole = role.find((r) => {
            const name = typeof r === 'string' ? r : r.name;
            return name === 'workspace-admin' || name.startsWith('team-');
        });

        if (!workspaceRole) return 'Membre';

        role = typeof workspaceRole === 'string' ? workspaceRole : workspaceRole.name;
    }

    // Handle role object
    if (typeof role === 'object' && 'name' in role) {
        role = role.name;
    }

    // Format the role string
    switch (role) {
        case 'workspace-admin':
            return 'Admin Workspace';
        case 'team-lead':
            return 'Chef d\'équipe';
        case 'team-member':
            return 'Membre';
        default:
            return 'Membre';
    }
}
