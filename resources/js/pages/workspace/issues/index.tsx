import WorkspaceLayout from "@/layouts/workspace-layout";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { Plus, Filter } from "lucide-react";

export default function IssuesIndex() {
    return (
        <WorkspaceLayout
            header={
                <div className="flex flex-1 items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm font-semibold">Toutes les tâches</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="size-4" />
                            Filtrer
                        </Button>
                        <Button size="sm">
                            <Plus className="size-4" />
                            Nouvelle tâche
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Toutes les tâches - Workspace" />

            <div>
                <p>Liste des tâches...</p>
            </div>
        </WorkspaceLayout>
    )
}
