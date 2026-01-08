import type { IssueLabel, IssuePriority, IssueStatus } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand';
import type { MyIssue } from '@/components/swell/workspace/my-issues/types';

type InitializeData = {
    issues: MyIssue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
};

type MyIssuesStore = {
    // State
    issues: MyIssue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    updatingIssues: Set<number>;

    // Actions d'initialisation
    initialize: (data: InitializeData) => void;
    setIssues: (issues: MyIssue[]) => void;

    // Actions de manipulation d'issues (état local uniquement)
    updateIssue: (issue: MyIssue) => void;
    updateIssuePriority: (issueId: number, priority: IssuePriority) => void;
    updateIssueStatus: (issueId: number, status: IssueStatus) => void;
    updateIssueLabels: (issueId: number, labels: IssueLabel[]) => void;
    updateIssueDueDate: (issueId: number, dueDate: string | null) => void;

    // Actions avec appels serveur
    performUpdateStatus: (issueId: number, statusSlug: string, currentStatus: IssueStatus) => void;
    performUpdatePriority: (issueId: number, priorityId: number, currentPriority: IssuePriority) => void;
    performToggleLabel: (issueId: number, labelId: number, currentLabels: IssueLabel[]) => void;
    performUpdateDueDate: (issueId: number, dueDate: string | null, currentDueDate: string | null | undefined) => void;

    // Helper
    isIssueUpdating: (issueId: number) => boolean;
    getIssueById: (issueId: number) => MyIssue | undefined;
};

export const useMyIssuesStore = create<MyIssuesStore>((set, get) => ({
    // État initial
    issues: [],
    statuses: [],
    priorities: [],
    labels: [],
    updatingIssues: new Set<number>(),

    // Actions d'initialisation
    initialize: ({ issues, statuses, priorities, labels }) => {
        set({ issues, statuses, priorities, labels });
    },

    setIssues: (issues) => set({ issues }),

    // Actions locales
    updateIssue: (issue) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issue.id ? issue : i)),
        })),

    updateIssuePriority: (issueId, priority) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issueId ? { ...i, priority } : i)),
        })),

    updateIssueStatus: (issueId, status) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issueId ? { ...i, status } : i)),
        })),

    updateIssueLabels: (issueId, labels) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issueId ? { ...i, labels } : i)),
        })),

    updateIssueDueDate: (issueId, dueDate) =>
        set((state) => ({
            issues: state.issues.map((i) => (i.id === issueId ? { ...i, dueDate: dueDate || undefined } : i)),
        })),

    // Actions serveur
    performUpdateStatus: (issueId, statusSlug, currentStatus) => {
        if (!issueId) return;

        const { statuses, updateIssueStatus, updatingIssues } = get();

        const newStatus = statuses.find((s) => s.slug === statusSlug);

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
                    toast.success('Statut mis à jour');
                },
                onError: (errors) => {
                    updateIssueStatus(issueId, currentStatus);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).status_id || 'Erreur lors de la mise à jour';
                    toast.error(errorMessage);
                },
            },
        );
    },

    performUpdatePriority: (issueId, priorityId, currentPriority) => {
        if (!issueId) return;

        const { priorities, updateIssuePriority, updatingIssues } = get();

        const newPriority = priorities.find((p) => p.id === priorityId);

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
                    toast.success('Priorité mise à jour');
                },
                onError: (errors) => {
                    updateIssuePriority(issueId, currentPriority);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).priority_id || 'Erreur lors de la mise à jour';
                    toast.error(errorMessage);
                },
            },
        );
    },

    performToggleLabel: (issueId, labelId, currentLabels) => {
        if (!issueId) return;

        const { labels, updateIssueLabels, updatingIssues } = get();

        const label = labels.find((l) => l.id === labelId);
        if (!label) {
            toast.error('Étiquette invalide');
            return;
        }

        const hasLabel = currentLabels.some((l) => l.id === labelId);
        const newLabels = hasLabel ? currentLabels.filter((l) => l.id !== labelId) : [...currentLabels, label];

        updateIssueLabels(issueId, newLabels);
        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.patch(
            route('workspace.issues.update-label', { issue: issueId }),
            { label_id: labelId },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });
                    toast.success(hasLabel ? 'Étiquette retirée' : 'Étiquette ajoutée');
                },
                onError: (errors) => {
                    updateIssueLabels(issueId, currentLabels);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).label_id || 'Erreur lors de la mise à jour';
                    toast.error(errorMessage);
                },
            },
        );
    },

    performUpdateDueDate: (issueId, dueDate, currentDueDate) => {
        if (!issueId) return;

        const { updateIssueDueDate, updatingIssues } = get();

        if (dueDate === currentDueDate) return;

        updateIssueDueDate(issueId, dueDate);
        set({ updatingIssues: new Set(updatingIssues).add(issueId) });

        router.patch(
            route('workspace.issues.update-due-date', { issue: issueId }),
            { due_date: dueDate },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });
                    toast.success("Date d'échéance mise à jour");
                },
                onError: (errors) => {
                    updateIssueDueDate(issueId, currentDueDate || null);
                    const { updatingIssues } = get();
                    const newSet = new Set(updatingIssues);
                    newSet.delete(issueId);
                    set({ updatingIssues: newSet });

                    const errorMessage = (errors as Record<string, string>).due_date || 'Erreur lors de la mise à jour';
                    toast.error(errorMessage);
                },
            },
        );
    },

    // Helpers
    isIssueUpdating: (issueId) => {
        const { updatingIssues } = get();
        return updatingIssues.has(issueId);
    },

    getIssueById: (issueId) => {
        const { issues } = get();
        return issues.find((i) => i.id === issueId);
    },
}));
