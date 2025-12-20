import WorkspaceLayout from '@/layouts/workspace-layout';
import Header from '@/components/swell/workspace/layout/headers/issues/header';
import { Head } from '@inertiajs/react';

export default function Issues({ team, issues, filters, isLead, isMember }) {
    console.log([
        'team', team,
        'issues', issues,
        'filters', filters,
        'isLead', isLead,
        'isMember', isMember
    ])
    
    return (
        <WorkspaceLayout header={<Header />}>
            <Head title="Teams - Workspace" />

            <div className="w-full">
                content
            </div>
        </WorkspaceLayout>
    );
}
