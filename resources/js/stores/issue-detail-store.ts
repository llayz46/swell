import type {
    IssueActivity,
    IssueAssignee,
    IssueComment,
    IssueDetail,
    IssueLabel,
    IssuePriority,
    IssueStatus,
} from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand';

type InitializeData = {
    issue: IssueDetail;
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    teamMembers: IssueAssignee[];
};

type IssueDetailStore = {
    // State
    issue: IssueDetail | null;
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    teamMembers: IssueAssignee[];
    isUpdating: boolean;
    isSubmittingComment: boolean;
    editingCommentId: number | null;
    replyingToCommentId: number | null;

    // Actions d'initialisation
    initialize: (data: InitializeData) => void;
    setIssue: (issue: IssueDetail) => void;

    // Issue field updates
    performUpdateStatus: (statusSlug: string) => void;
    performUpdatePriority: (priorityId: number) => void;
    performUpdateAssignee: (assigneeId: number | null) => void;
    performToggleLabel: (labelId: number) => void;
    performUpdateDueDate: (dueDate: string | null) => void;
    performToggleSubscription: () => void;

    // Comments
    setEditingCommentId: (id: number | null) => void;
    setReplyingToCommentId: (id: number | null) => void;
    performAddComment: (content: string, parentId?: number | null) => void;
    performUpdateComment: (commentId: number, content: string) => void;
    performDeleteComment: (commentId: number) => void;

    // Local state updates
    addComment: (comment: IssueComment) => void;
    updateComment: (commentId: number, content: string) => void;
    removeComment: (commentId: number) => void;
    addActivity: (activity: IssueActivity) => void;
};

export const useIssueDetailStore = create<IssueDetailStore>((set, get) => ({
    // Initial state
    issue: null,
    statuses: [],
    priorities: [],
    labels: [],
    teamMembers: [],
    isUpdating: false,
    isSubmittingComment: false,
    editingCommentId: null,
    replyingToCommentId: null,

    // Initialization
    initialize: ({ issue, statuses, priorities, labels, teamMembers }) => {
        set({ issue, statuses, priorities, labels, teamMembers });
    },

    setIssue: (issue) => set({ issue }),

    // Status update
    performUpdateStatus: (statusSlug) => {
        const { issue, statuses } = get();
        if (!issue) return;

        const newStatus = statuses.find((s) => s.slug === statusSlug);
        if (!newStatus || newStatus.id === issue.status.id) return;

        const currentStatus = issue.status;
        set({ issue: { ...issue, status: newStatus }, isUpdating: true });

        router.patch(
            route('workspace.issues.update-status', { issue: issue.id }),
            { status_id: newStatus.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    set({ isUpdating: false });
                    toast.success('Statut mis à jour');
                },
                onError: () => {
                    const { issue: currentIssue } = get();
                    if (currentIssue) {
                        set({ issue: { ...currentIssue, status: currentStatus }, isUpdating: false });
                    }
                    toast.error('Erreur lors de la mise à jour du statut');
                },
            },
        );
    },

    // Priority update
    performUpdatePriority: (priorityId) => {
        const { issue, priorities } = get();
        if (!issue) return;

        const newPriority = priorities.find((p) => p.id === priorityId);
        if (!newPriority || newPriority.id === issue.priority.id) return;

        const currentPriority = issue.priority;
        set({ issue: { ...issue, priority: newPriority }, isUpdating: true });

        router.patch(
            route('workspace.issues.update-priority', { issue: issue.id }),
            { priority_id: newPriority.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    set({ isUpdating: false });
                    toast.success('Priorité mise à jour');
                },
                onError: () => {
                    const { issue: currentIssue } = get();
                    if (currentIssue) {
                        set({ issue: { ...currentIssue, priority: currentPriority }, isUpdating: false });
                    }
                    toast.error('Erreur lors de la mise à jour de la priorité');
                },
            },
        );
    },

    // Assignee update
    performUpdateAssignee: (assigneeId) => {
        const { issue, teamMembers } = get();
        if (!issue) return;

        const newAssignee = assigneeId ? teamMembers.find((m) => m.id === assigneeId) || null : null;
        const currentAssignee = issue.assignee;

        set({ issue: { ...issue, assignee: newAssignee }, isUpdating: true });

        router.patch(
            route('workspace.issues.update-assignee', { issue: issue.id }),
            { assignee_id: assigneeId },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    set({ isUpdating: false });
                    toast.success('Assigné mis à jour');
                },
                onError: () => {
                    const { issue: currentIssue } = get();
                    if (currentIssue) {
                        set({ issue: { ...currentIssue, assignee: currentAssignee }, isUpdating: false });
                    }
                    toast.error("Erreur lors de la mise à jour de l'assigné");
                },
            },
        );
    },

    // Label toggle
    performToggleLabel: (labelId) => {
        const { issue, labels: allLabels } = get();
        if (!issue) return;

        const label = allLabels.find((l) => l.id === labelId);
        if (!label) return;

        const currentLabels = issue.labels;
        const hasLabel = currentLabels.some((l) => l.id === labelId);
        const newLabels = hasLabel ? currentLabels.filter((l) => l.id !== labelId) : [...currentLabels, label];

        set({ issue: { ...issue, labels: newLabels }, isUpdating: true });

        router.patch(
            route('workspace.issues.update-label', { issue: issue.id }),
            { label_id: labelId },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    set({ isUpdating: false });
                    toast.success(hasLabel ? 'Étiquette retirée' : 'Étiquette ajoutée');
                },
                onError: () => {
                    const { issue: currentIssue } = get();
                    if (currentIssue) {
                        set({ issue: { ...currentIssue, labels: currentLabels }, isUpdating: false });
                    }
                    toast.error("Erreur lors de la mise à jour de l'étiquette");
                },
            },
        );
    },

    // Due date update
    performUpdateDueDate: (dueDate) => {
        const { issue } = get();
        if (!issue) return;

        const currentDueDate = issue.dueDate;
        if (dueDate === currentDueDate) return;

        set({ issue: { ...issue, dueDate: dueDate || undefined }, isUpdating: true });

        router.patch(
            route('workspace.issues.update-due-date', { issue: issue.id }),
            { due_date: dueDate },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    set({ isUpdating: false });
                    toast.success("Date d'échéance mise à jour");
                },
                onError: () => {
                    const { issue: currentIssue } = get();
                    if (currentIssue) {
                        set({ issue: { ...currentIssue, dueDate: currentDueDate }, isUpdating: false });
                    }
                    toast.error("Erreur lors de la mise à jour de la date d'échéance");
                },
            },
        );
    },

    // Subscription toggle
    performToggleSubscription: () => {
        const { issue } = get();
        if (!issue) return;

        const wasSubscribed = issue.isSubscribed;
        set({
            issue: {
                ...issue,
                isSubscribed: !wasSubscribed,
                subscribersCount: issue.subscribersCount + (wasSubscribed ? -1 : 1),
            },
            isUpdating: true,
        });

        const routeName = wasSubscribed ? 'workspace.issues.unsubscribe' : 'workspace.issues.subscribe';
        const method = wasSubscribed ? 'delete' : 'post';

        router[method](route(routeName, { issue: issue.id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                set({ isUpdating: false });
                toast.success(wasSubscribed ? 'Désabonné des notifications' : 'Abonné aux notifications');
            },
            onError: () => {
                const { issue: currentIssue } = get();
                if (currentIssue) {
                    set({
                        issue: {
                            ...currentIssue,
                            isSubscribed: wasSubscribed,
                            subscribersCount: currentIssue.subscribersCount + (wasSubscribed ? 1 : -1),
                        },
                        isUpdating: false,
                    });
                }
                toast.error("Erreur lors de la modification de l'abonnement");
            },
        });
    },

    // Comment editing state
    setEditingCommentId: (id) => set({ editingCommentId: id, replyingToCommentId: null }),
    setReplyingToCommentId: (id) => set({ replyingToCommentId: id, editingCommentId: null }),

    // Add comment
    performAddComment: (content, parentId = null) => {
        const { issue } = get();
        if (!issue) return;

        set({ isSubmittingComment: true });

        router.post(
            route('workspace.issues.comments.store', { issue: issue.id }),
            { content, parent_id: parentId },
            {
                preserveScroll: true,
                preserveState: false, // Reload to get new comment with full data
                onSuccess: () => {
                    set({ isSubmittingComment: false, replyingToCommentId: null });
                    toast.success('Commentaire ajouté');
                },
                onError: () => {
                    set({ isSubmittingComment: false });
                    toast.error("Erreur lors de l'ajout du commentaire");
                },
            },
        );
    },

    // Update comment
    performUpdateComment: (commentId, content) => {
        const { issue } = get();
        if (!issue) return;

        set({ isSubmittingComment: true });

        router.patch(
            route('workspace.issues.comments.update', { issue: issue.id, comment: commentId }),
            { content },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    set({ isSubmittingComment: false, editingCommentId: null });
                    toast.success('Commentaire modifié');
                },
                onError: () => {
                    set({ isSubmittingComment: false });
                    toast.error('Erreur lors de la modification du commentaire');
                },
            },
        );
    },

    // Delete comment
    performDeleteComment: (commentId) => {
        const { issue } = get();
        if (!issue) return;

        router.delete(route('workspace.issues.comments.destroy', { issue: issue.id, comment: commentId }), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                toast.success('Commentaire supprimé');
            },
            onError: () => {
                toast.error('Erreur lors de la suppression du commentaire');
            },
        });
    },

    // Local state helpers (for optimistic updates if needed later)
    addComment: (comment) => {
        const { issue } = get();
        if (!issue) return;

        if (comment.parentId) {
            // Add as reply
            const updatedComments = issue.comments.map((c) => {
                if (c.id === comment.parentId) {
                    return { ...c, replies: [...(c.replies || []), comment] };
                }
                return c;
            });
            set({ issue: { ...issue, comments: updatedComments } });
        } else {
            // Add as root comment
            set({ issue: { ...issue, comments: [...issue.comments, comment] } });
        }
    },

    updateComment: (commentId, content) => {
        const { issue } = get();
        if (!issue) return;

        const updateInList = (comments: IssueComment[]): IssueComment[] =>
            comments.map((c) => {
                if (c.id === commentId) {
                    return { ...c, content, editedAt: new Date().toISOString() };
                }
                if (c.replies) {
                    return { ...c, replies: updateInList(c.replies) };
                }
                return c;
            });

        set({ issue: { ...issue, comments: updateInList(issue.comments) } });
    },

    removeComment: (commentId) => {
        const { issue } = get();
        if (!issue) return;

        const removeFromList = (comments: IssueComment[]): IssueComment[] =>
            comments
                .filter((c) => c.id !== commentId)
                .map((c) => ({
                    ...c,
                    replies: c.replies ? removeFromList(c.replies) : undefined,
                }));

        set({ issue: { ...issue, comments: removeFromList(issue.comments) } });
    },

    addActivity: (activity) => {
        const { issue } = get();
        if (!issue) return;
        set({ issue: { ...issue, activities: [activity, ...issue.activities] } });
    },
}));
