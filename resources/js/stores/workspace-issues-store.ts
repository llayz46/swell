import { create } from 'zustand';
import type { Issue, IssueStatus, IssuePriority, IssueLabel, IssueAssignee, Team } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

type Filters = {
    status: string[];
    assignee: string[];
    priority: string[];
    labels: string[];
};

type InitializeData = {
    team: Team;
    issues: Issue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    filters?: Partial<Filters>;
    isLead: boolean;
    isMember: boolean;
};

type WorkspaceIssuesStore = {
    // État
    team: Team | null;
    issues: Issue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    filters: Filters;
    isLead: boolean;
    isMember: boolean;
    createIssueDialogOpen: boolean;
    createIssueDialogStatusId: string | null;
    updatingIssues: Set<number>;

    // Actions d'initialisation
    initialize: (data: InitializeData) => void;
    setTeam: (team: Team) => void;
    setIssues: (issues: Issue[]) => void;
    setStatuses: (statuses: IssueStatus[]) => void;
    setPriorities: (priorities: IssuePriority[]) => void;
    setLabels: (labels: IssueLabel[]) => void;
    setFilters: (filters: Partial<Filters>) => void;
    setIsLead: (isLead: boolean) => void;
    setIsMember: (isMember: boolean) => void;

    // Actions du dialog de création
    openCreateIssueDialog: (statusId?: string) => void;
    closeCreateIssueDialog: () => void;

    // Actions de manipulation d'issues (état local uniquement)
    updateIssue: (issue: Issue) => void;
    updateIssuePriority: (issueId: number, priority: IssuePriority) => void;
    updateIssueStatus: (issueId: number, status: IssueStatus) => void;
    updateIssueAssignee: (issueId: number, assignee: IssueAssignee | null) => void;
    removeIssue: (issueId: number) => void;
    addIssue: (issue: Issue) => void;

    // Actions avec appels serveur
    performUpdateStatus: (issueId: number, statusIdOrSlug: number | string, currentStatus: IssueStatus) => void;
    performUpdatePriority: (issueId: number, priorityId: number, currentPriority: IssuePriority) => void;
    performUpdateAssignee: (issueId: number, newAssignee: IssueAssignee | null, currentAssignee: IssueAssignee | null) => void;
    performDeleteIssue: (issueId: number, onSuccess?: () => void) => void;

    // Helper pour vérifier si une issue est en cours de mise à jour
    isIssueUpdating: (issueId: number) => boolean;

    // Actions de filtrage
    toggleFilter: (filterType: keyof Filters, value: string) => void;
    clearFilters: () => void;
    getActiveFiltersCount: () => number;

    // Helpers pour filtrer les issues
    filterByStatus: (statusId: string) => Issue[];
    filterByAssignee: (assigneeId: string | null) => Issue[];
    filterByPriority: (priorityId: string) => Issue[];
    filterByLabel: (labelId: string) => Issue[];
    hasActiveFilters: () => boolean;
    getFilteredIssues: () => Issue[];

    // Helper pour grouper les issues par statut
    getIssuesByStatus: () => Record<string, Issue[]>;
};

export const useWorkspaceIssuesStore = create<WorkspaceIssuesStore>((set, get) => ({
    // État initial
    team: null,
    issues: [],
    statuses: [],
    priorities: [],
    labels: [],
    filters: {
        status: [],
        assignee: [],
        priority: [],
        labels: [],
    },
    isLead: false,
    isMember: false,
    createIssueDialogOpen: false,
    createIssueDialogStatusId: null,
    updatingIssues: new Set<number>(),

    // Actions d'initialisation
    initialize: ({ team, issues, statuses, priorities, labels, filters, isLead, isMember }) =>
        set((state) => ({
            team,
            issues,
            statuses,
            priorities,
            labels,
            filters: { ...state.filters, ...filters },
            isLead,
            isMember,
        })),

    setTeam: (team) => set({ team }),
    setIssues: (issues) => set({ issues }),
    setStatuses: (statuses) => set({ statuses }),
    setPriorities: (priorities) => set({ priorities }),
    setLabels: (labels) => set({ labels }),
    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),
    setIsLead: (isLead) => set({ isLead }),
    setIsMember: (isMember) => set({ isMember }),

    // Actions du dialog de création
    openCreateIssueDialog: (statusId) =>
        set({
            createIssueDialogOpen: true,
            createIssueDialogStatusId: statusId || null,
        }),
    closeCreateIssueDialog: () =>
        set({
            createIssueDialogOpen: false,
            createIssueDialogStatusId: null,
        }),

    updateIssue: (issue) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issue.id ? issue : i)),
        })),
        
    updateIssuePriority: (issueId, priority) =>
        set((state) => ({
            issues: state.issues.map((i) =>
                i.id === issueId ? { ...i, priority } : i
            ),
        })),  
        
    updateIssueStatus: (issueId, status) =>
        set((state) => ({
            issues: state.issues.map((i) =>
                i.id === issueId ? { ...i, status } : i
            ),
        })),  

    updateIssueAssignee: (issueId, assignee) =>
        set((state) => ({
            issues: state.issues.map((i) =>
                i.id === issueId ? { ...i, assignee } : i
            ),
        })),  

    removeIssue: (issueId) =>
        set((state) => ({
            issues: state.issues.filter((i) => i.id !== issueId),
        })),

    addIssue: (issue) =>
        set((state) => ({
            issues: [...state.issues, issue],
        })),

    // Actions avec appels serveur
    performUpdateStatus: (issueId, statusIdOrSlug, currentStatus) => {
        if (!issueId) return;

        const { statuses, updateIssueStatus, updatingIssues } = get();

        const newStatus =
            typeof statusIdOrSlug === 'number'
            ? statuses.find((s) => s.id === String(statusIdOrSlug))
                : statuses.find((s) => s.slug === statusIdOrSlug);

        if (!newStatus) {
            toast.error('Statut invalide');
            return;
        }

        if (newStatus.id === currentStatus.id) return;

        updateIssueStatus(issueId, newStatus);
        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.patch(
            route('workspace.issues.update-status', { issue: issueId }),
            { status_id: newStatus.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });
                    toast.success('Statut mis à jour avec succès');
                },
                onError: (errors) => {
                    updateIssueStatus(issueId, currentStatus);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).status_id || 'Erreur lors de la mise à jour du statut';
                    toast.error(errorMessage);
                },
            },
        );
    },

    performUpdatePriority: (issueId, priorityId, currentPriority) => {
        if (!issueId) return;

        const { priorities, updateIssuePriority, updatingIssues } = get();

        const newPriority = priorities.find((p) => Number(p.id) === priorityId);

        if (!newPriority) {
            toast.error('Priorité invalide');
            return;
        }

        if (newPriority.id === currentPriority.id) return;

        updateIssuePriority(issueId, newPriority);
        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.patch(
            route('workspace.issues.update-priority', { issue: issueId }),
            { priority_id: newPriority.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });
                    toast.success('Priorité mise à jour avec succès');
                },
                onError: (errors) => {
                    updateIssuePriority(issueId, currentPriority);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).priority_id || 'Erreur lors de la mise à jour de la priorité';
                    toast.error(errorMessage);
                },
            },
        );
    },

    performUpdateAssignee: (issueId, newAssignee, currentAssignee) => {
        if (!issueId) return;

        const { updateIssueAssignee, updatingIssues } = get();

        // Mise à jour optimiste avec l'objet complet
        updateIssueAssignee(issueId, newAssignee);
        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.patch(
            route('workspace.issues.update-assignee', { issue: issueId }),
            { assignee_id: newAssignee?.id || null },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });
                    toast.success('Assignation mise à jour avec succès');
                },
                onError: (errors) => {
                    updateIssueAssignee(issueId, currentAssignee);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).assignee_id || "Erreur lors de la mise à jour de l'assignation";
                    toast.error(errorMessage);
                },
            },
        );
    },

    performDeleteIssue: (issueId, onSuccess) => {
        if (!issueId) return;

        const { updatingIssues } = get();

        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.delete(route('workspace.issues.destroy', { issue: issueId }), {
            preserveScroll: true,
            onSuccess: () => {
                const { updatingIssues } = get();
                const newSet = new Set(updatingIssues);
                newSet.delete(issueId);
                set({ updatingIssues: newSet });
                toast.success('Issue supprimée avec succès');

                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (errors) => {
                const { updatingIssues } = get();
                const newSet = new Set(updatingIssues);
                newSet.delete(issueId);
                set({ updatingIssues: newSet });

                const errorMessage = (errors as Record<string, string>).message || "Erreur lors de la suppression de l'issue";
                toast.error(errorMessage);
            },
        });
    },

    // Helper pour vérifier si une issue est en cours de mise à jour
    isIssueUpdating: (issueId) => {
        const { updatingIssues } = get();
        return updatingIssues.has(issueId);
    },

    // Actions de filtrage
    toggleFilter: (filterType, value) =>
        set((state) => {
            const currentFilters = state.filters[filterType];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter((v) => v !== value)
                : [...currentFilters, value];

            return {
                filters: {
                    ...state.filters,
                    [filterType]: newFilters,
                },
            };
        }),

    clearFilters: () =>
        set({
            filters: {
                status: [],
                assignee: [],
                priority: [],
                labels: [],
            },
        }),

    getActiveFiltersCount: () => {
        const { filters } = get();
        return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
    },

    // Helpers pour filtrer les issues
    filterByStatus: (statusId) => {
        const { issues } = get();
        return issues.filter((issue) => issue.status.id === statusId);
    },

    filterByAssignee: (assigneeId) => {
        const { issues } = get();
        if (assigneeId === null) {
            return issues.filter((issue) => !issue.assignee);
        }
        return issues.filter((issue) => issue.assignee?.id.toString() === assigneeId);
    },

    filterByPriority: (priorityId) => {
        const { issues } = get();
        return issues.filter((issue) => issue.priority.id === priorityId);
    },

    filterByLabel: (labelId) => {
        const { issues } = get();
        return issues.filter((issue) => issue.labels.some((label) => label.id === labelId));
    },
    
    hasActiveFilters: () => {
        const { filters } = get();
        return Object.values(filters).some((filterArray) => filterArray.length > 0);
    },

    getFilteredIssues: () => {
        const { issues, filters } = get();

        return issues.filter((issue) => {
            // Si aucun filtre n'est actif, retourner toutes les issues
            if (
                filters.status.length === 0 &&
                filters.assignee.length === 0 &&
                filters.priority.length === 0 &&
                filters.labels.length === 0
            ) {
                return true;
            }

            // Vérifier chaque type de filtre
            const statusMatch =
                filters.status.length === 0 || filters.status.includes(issue.status.id);
            const priorityMatch =
                filters.priority.length === 0 || filters.priority.includes(issue.priority.id);
            const labelMatch =
                filters.labels.length === 0 ||
                issue.labels.some((label) => filters.labels.includes(label.id));
            const assigneeMatch =
                filters.assignee.length === 0 ||
                (issue.assignee && filters.assignee.includes(issue.assignee.id.toString())) ||
                (filters.assignee.includes('unassigned') && !issue.assignee);

            return statusMatch && priorityMatch && labelMatch && assigneeMatch;
        });
    },

    // Helper pour grouper les issues par statut
    getIssuesByStatus: () => {
        const { issues } = get();
        return issues.reduce(
            (acc, issue) => {
                const statusId = issue.status.id;
                if (!acc[statusId]) {
                    acc[statusId] = [];
                }
                acc[statusId].push(issue);
                return acc;
            },
            {} as Record<string, Issue[]>
        );
    },
}));
