import WorkspaceLayout from "@/layouts/workspace-layout";
import { Head } from "@inertiajs/react";

export default function Index() {
    return (
        <WorkspaceLayout
            header={
                <div className="flex flex-1 items-center gap-2">
                    <h1 className="text-sm font-semibold">Tableau de bord</h1>
                </div>
            }
        >
            <Head title="Tableau de bord - Workspace" />
            index page workspace
        </WorkspaceLayout>
    )
}