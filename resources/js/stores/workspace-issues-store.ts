import { create } from 'zustand';
import type { Issue, IssueStatus, IssuePriority, IssueLabel, Team } from '@/types/workspace';

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

    // Actions de manipulation d'issues
    updateIssue: (issue: Issue) => void;
    updateIssuePriority: (issueId: number, priority: IssuePriority) => void;
    updateIssueStatus: (issueId: number, status: IssueStatus) => void;
    updateIssueAssignee: (issueId: number, assignee: IssueAssignee | null) => void;
    removeIssue: (issueId: number) => void;
    addIssue: (issue: Issue) => void;

    // Actions de filtrage
    toggleFilter: (filterType: keyof Filters, value: string) => void;
    clearFilters: () => void;
    getActiveFiltersCount: () => number;

    // Helpers pour filtrer les issues
    filterByStatus: (statusId: string) => Issue[];
    filterByAssignee: (assigneeId: string | null) => Issue[];
    filterByPriority: (priorityId: string) => Issue[];
    filterByLabel: (labelId: string) => Issue[];
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
