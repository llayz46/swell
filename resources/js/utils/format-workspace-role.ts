/**
 * Format workspace role for display
 * @param role - Can be a role string, role object, or array of role strings
 */
export function formatWorkspaceRole(role: string | { name: string } | string[] | { name: string }[]): string {
    // Handle array of roles - return the first workspace/team role
    if (Array.isArray(role)) {
        const workspaceRole = role.find((r) => {
            const name = typeof r === 'string' ? r : r.name;
            return name.startsWith('workspace-') || name.startsWith('team-');
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
        case 'workspace-lead':
            return 'Lead Workspace';
        case 'workspace-member':
            return 'Membre Workspace';
        case 'team-lead':
            return 'Chef d\'équipe';
        case 'team-member':
            return 'Membre de l\'équipe';
        default:
            return 'Membre';
    }
}
