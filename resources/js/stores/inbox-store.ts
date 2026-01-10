import type { InboxItem, NotificationType } from '@/types/workspace';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand';

type OrderBy = 'newest' | 'oldest';

type Filters = {
    types: NotificationType[];
    showRead: boolean;
    showSnoozed: boolean;
    unreadFirst: boolean;
};

type DisplayProperties = {
    showId: boolean;
    showStatusIcon: boolean;
};

type InitializeData = {
    items: InboxItem[];
    filters?: Partial<Filters>;
    displayProperties?: Partial<DisplayProperties>;
};

type InboxStore = {
    // State
    items: InboxItem[];
    selectedItemId: number | null;
    orderBy: OrderBy;
    filters: Filters;
    displayProperties: DisplayProperties;
    updatingItems: Set<number>;

    // Initialize
    initialize: (data: InitializeData) => void;
    setItems: (items: InboxItem[]) => void;

    // Selection
    selectItem: (id: number | null) => void;
    getSelectedItem: () => InboxItem | null;

    // Filters & Display
    setOrderBy: (orderBy: OrderBy) => void;
    setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
    toggleTypeFilter: (type: NotificationType) => void;
    setDisplayProperty: <K extends keyof DisplayProperties>(key: K, value: DisplayProperties[K]) => void;

    // Filtered & Grouped items
    getFilteredItems: () => InboxItem[];
    getGroupedItems: () => { label: string; items: InboxItem[] }[];

    // Actions (local state)
    markAsRead: (id: number) => void;
    markAsUnread: (id: number) => void;
    removeItem: (id: number) => void;

    // Actions with server sync
    performMarkAsRead: (id: number) => void;
    performMarkAsUnread: (id: number) => void;
    performMarkAllAsRead: () => void;
    performSnooze: (id: number, until: string) => void;
    performUnsnooze: (id: number) => void;
    performDelete: (id: number) => void;
    performDeleteAll: () => void;
    performDeleteRead: () => void;

    // Helpers
    getUnreadCount: () => number;
    isItemUpdating: (id: number) => boolean;
};

function getDateGroup(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    if (date >= today) {
        return "Aujourd'hui";
    } else if (date >= yesterday) {
        return 'Hier';
    } else if (date >= weekAgo) {
        return 'Cette semaine';
    } else {
        return 'Plus ancien';
    }
}

export const useInboxStore = create<InboxStore>((set, get) => ({
    // Initial state
    items: [],
    selectedItemId: null,
    orderBy: 'newest',
    filters: {
        types: [],
        showRead: true,
        showSnoozed: false,
        unreadFirst: true,
    },
    displayProperties: {
        showId: false,
        showStatusIcon: true,
    },
    updatingItems: new Set<number>(),

    // Initialize
    initialize: ({ items, filters, displayProperties }) => {
        set((state) => ({
            items,
            filters: { ...state.filters, ...filters },
            displayProperties: { ...state.displayProperties, ...displayProperties },
        }));
    },

    setItems: (items) => set({ items }),

    // Selection
    selectItem: (id) => set({ selectedItemId: id }),

    getSelectedItem: () => {
        const { items, selectedItemId } = get();
        return items.find((item) => item.id === selectedItemId) || null;
    },

    // Filters & Display
    setOrderBy: (orderBy) => set({ orderBy }),

    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),

    toggleTypeFilter: (type) =>
        set((state) => {
            const types = state.filters.types.includes(type)
                ? state.filters.types.filter((t) => t !== type)
                : [...state.filters.types, type];
            return { filters: { ...state.filters, types } };
        }),

    setDisplayProperty: (key, value) =>
        set((state) => ({
            displayProperties: { ...state.displayProperties, [key]: value },
        })),

    // Filtered items
    getFilteredItems: () => {
        const { items, filters, orderBy } = get();
        const now = new Date();

        const filtered = items.filter((item) => {
            // Filter by read status
            if (!filters.showRead && item.read) return false;

            // Filter by snoozed status
            if (!filters.showSnoozed && item.snoozedUntil) {
                const snoozedUntil = new Date(item.snoozedUntil);
                if (snoozedUntil > now) return false;
            }

            // Filter by type
            if (filters.types.length > 0 && !filters.types.includes(item.type)) return false;

            return true;
        });

        // Sort
        filtered.sort((a, b) => {
            // Unread first if enabled
            if (filters.unreadFirst) {
                if (!a.read && b.read) return -1;
                if (a.read && !b.read) return 1;
            }

            // Then by date
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return orderBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    },

    // Grouped items by date
    getGroupedItems: () => {
        const filtered = get().getFilteredItems();
        const groups: Record<string, InboxItem[]> = {};

        filtered.forEach((item) => {
            const group = getDateGroup(item.createdAt);
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
        });

        const order = ["Aujourd'hui", 'Hier', 'Cette semaine', 'Plus ancien'];
        return order
            .filter((label) => groups[label]?.length > 0)
            .map((label) => ({ label, items: groups[label] }));
    },

    // Local state actions
    markAsRead: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, read: true, readAt: new Date().toISOString() } : item,
            ),
        })),

    markAsUnread: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, read: false, readAt: undefined } : item,
            ),
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
        })),

    // Server sync actions
    performMarkAsRead: (id) => {
        const { markAsRead, updatingItems } = get();
        const item = get().items.find((i) => i.id === id);
        if (!item || item.read) return;

        markAsRead(id);
        set({ updatingItems: new Set(updatingItems).add(id) });

        router.patch(
            route('workspace.inbox.read', { inboxItem: id }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                },
                onError: () => {
                    get().markAsUnread(id);
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                    toast.error('Erreur lors du marquage comme lu');
                },
            },
        );
    },

    performMarkAsUnread: (id) => {
        const { markAsUnread, updatingItems } = get();
        const item = get().items.find((i) => i.id === id);
        if (!item || !item.read) return;

        markAsUnread(id);
        set({ updatingItems: new Set(updatingItems).add(id) });

        router.patch(
            route('workspace.inbox.unread', { inboxItem: id }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                },
                onError: () => {
                    get().markAsRead(id);
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                    toast.error('Erreur lors du marquage comme non lu');
                },
            },
        );
    },

    performMarkAllAsRead: () => {
        const { items } = get();
        const unreadItems = items.filter((i) => !i.read);
        if (unreadItems.length === 0) return;

        // Optimistic update
        set({
            items: items.map((item) => ({
                ...item,
                read: true,
                readAt: item.read ? item.readAt : new Date().toISOString(),
            })),
        });

        router.post(
            route('workspace.inbox.read-all'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Toutes les notifications marquées comme lues');
                },
                onError: () => {
                    // Rollback
                    router.reload({ only: ['items'] });
                    toast.error('Erreur lors du marquage');
                },
            },
        );
    },

    performSnooze: (id, until) => {
        const { updatingItems } = get();

        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, snoozedUntil: until } : item,
            ),
            updatingItems: new Set(updatingItems).add(id),
        }));

        router.patch(
            route('workspace.inbox.snooze', { inboxItem: id }),
            { until },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                    toast.success('Notification mise en veille');
                },
                onError: () => {
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === id ? { ...item, snoozedUntil: undefined } : item,
                        ),
                    }));
                    const newSet = new Set(get().updatingItems);
                    newSet.delete(id);
                    set({ updatingItems: newSet });
                    toast.error('Erreur lors de la mise en veille');
                },
            },
        );
    },

    performUnsnooze: (id) => {
        const { updatingItems } = get();
        const item = get().items.find((i) => i.id === id);
        const previousSnoozedUntil = item?.snoozedUntil;

        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, snoozedUntil: undefined } : item,
            ),
            updatingItems: new Set(updatingItems).add(id),
        }));

        router.delete(route('workspace.inbox.snooze', { inboxItem: id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                const newSet = new Set(get().updatingItems);
                newSet.delete(id);
                set({ updatingItems: newSet });
            },
            onError: () => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, snoozedUntil: previousSnoozedUntil } : item,
                    ),
                }));
                const newSet = new Set(get().updatingItems);
                newSet.delete(id);
                set({ updatingItems: newSet });
                toast.error('Erreur lors de la désactivation de la mise en veille');
            },
        });
    },

    performDelete: (id) => {
        const { removeItem, updatingItems, items } = get();
        const item = items.find((i) => i.id === id);
        if (!item) return;

        set({ updatingItems: new Set(updatingItems).add(id) });

        router.delete(route('workspace.inbox.destroy', { inboxItem: id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                removeItem(id);
                const newSet = new Set(get().updatingItems);
                newSet.delete(id);
                set({ updatingItems: newSet });
                toast.success('Notification supprimée');
            },
            onError: () => {
                const newSet = new Set(get().updatingItems);
                newSet.delete(id);
                set({ updatingItems: newSet });
                toast.error('Erreur lors de la suppression');
            },
        });
    },

    performDeleteAll: () => {
        router.delete(route('workspace.inbox.destroy-all'), {
            preserveScroll: true,
            onSuccess: () => {
                set({ items: [], selectedItemId: null });
                toast.success('Toutes les notifications supprimées');
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
        });
    },

    performDeleteRead: () => {
        const { items } = get();

        router.delete(route('workspace.inbox.destroy-read'), {
            preserveScroll: true,
            onSuccess: () => {
                set((state) => ({
                    items: state.items.filter((i) => !i.read),
                    selectedItemId:
                        state.selectedItemId && items.find((i) => i.id === state.selectedItemId)?.read
                            ? null
                            : state.selectedItemId,
                }));
                toast.success('Notifications lues supprimées');
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
        });
    },

    // Helpers
    getUnreadCount: () => {
        const { items } = get();
        return items.filter((item) => !item.read).length;
    },

    isItemUpdating: (id) => {
        const { updatingItems } = get();
        return updatingItems.has(id);
    },
}));
