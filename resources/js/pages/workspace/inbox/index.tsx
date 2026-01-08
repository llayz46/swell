import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from '@/components/ui/switch';
import {
    InboxEmptyState,
    InboxGroupHeader,
    InboxLine,
    InboxPreview,
} from '@/components/swell/workspace/inbox';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { useInboxStore } from '@/stores/inbox-store';
import type { InboxItem } from '@/types/workspace';
import { Head, usePage } from '@inertiajs/react';
import { Archive, ArrowUpDown, CheckCheck, MoreHorizontal, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Index() {
    const { items: serverItems } = usePage<{ items: InboxItem[] }>().props;

    const {
        initialize,
        items,
        selectedItemId,
        selectItem,
        orderBy,
        setOrderBy,
        filters,
        setFilter,
        displayProperties,
        setDisplayProperty,
        getGroupedItems,
        getFilteredItems,
        getSelectedItem,
        getUnreadCount,
        performMarkAllAsRead,
        performDeleteAll,
        performDeleteRead,
    } = useInboxStore();

    useEffect(() => {
        initialize({ items: serverItems });
    }, [serverItems, initialize]);

    const groupedItems = getGroupedItems();
    const filteredItems = getFilteredItems();
    const selectedItem = getSelectedItem();
    const unreadCount = getUnreadCount();

    const getEmptyVariant = () => {
        if (items.length === 0) return 'empty';
        if (filteredItems.length === 0) return 'filtered';
        if (unreadCount === 0 && !filters.showRead) return 'zero';
        return 'empty';
    };

    return (
        <WorkspaceLayout>
            <Head title="Boîte de réception - Workspace" />

            <ResizablePanelGroup direction="horizontal" autoSaveId="inbox-panel-group" className="size-full">
                <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
                    <div className="flex h-10 items-center justify-between border-b border-border px-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Boîte de réception</h2>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                    {unreadCount}
                                </span>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="xs">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={performDeleteAll}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer toutes les notifications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={performDeleteRead}>
                                        <CheckCheck className="mr-2 h-4 w-4" />
                                        Supprimer les notifications lues
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Supprimer pour les issues terminées
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={performMarkAllAsRead}
                                disabled={unreadCount === 0}
                                title="Tout marquer comme lu"
                            >
                                <CheckCheck className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="xs">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuLabel className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Tri
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                        checked={orderBy === 'newest'}
                                        onCheckedChange={() => setOrderBy('newest')}
                                    >
                                        Plus récent
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={orderBy === 'oldest'}
                                        onCheckedChange={() => setOrderBy('oldest')}
                                    >
                                        Plus ancien
                                    </DropdownMenuCheckboxItem>

                                    <DropdownMenuSeparator />

                                    <div className="space-y-3 p-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-snoozed" className="text-sm">
                                                Afficher en veille
                                            </Label>
                                            <Switch
                                                id="show-snoozed"
                                                checked={filters.showSnoozed}
                                                onCheckedChange={(checked) => setFilter('showSnoozed', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-read" className="text-sm">
                                                Afficher lues
                                            </Label>
                                            <Switch
                                                id="show-read"
                                                checked={filters.showRead}
                                                onCheckedChange={(checked) => setFilter('showRead', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-unread-first" className="text-sm">
                                                Non lues en premier
                                            </Label>
                                            <Switch
                                                id="show-unread-first"
                                                checked={filters.unreadFirst}
                                                onCheckedChange={(checked) => setFilter('unreadFirst', checked)}
                                            />
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuLabel>Propriétés affichées</DropdownMenuLabel>
                                    <div className="space-y-3 p-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-id" className="text-sm">
                                                Identifiant
                                            </Label>
                                            <Switch
                                                id="show-id"
                                                checked={displayProperties.showId}
                                                onCheckedChange={(checked) => setDisplayProperty('showId', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-status-icon" className="text-sm">
                                                Icône de type
                                            </Label>
                                            <Switch
                                                id="show-status-icon"
                                                checked={displayProperties.showStatusIcon}
                                                onCheckedChange={(checked) =>
                                                    setDisplayProperty('showStatusIcon', checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100%-40px)]">
                        {filteredItems.length === 0 ? (
                            <InboxEmptyState variant={getEmptyVariant()} className="h-full" />
                        ) : (
                            groupedItems.map((group) => (
                                <div key={group.label}>
                                    <InboxGroupHeader label={group.label} count={group.items.length} />
                                    {group.items.map((item) => (
                                        <InboxLine
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedItemId === item.id}
                                            onClick={() => selectItem(item.id)}
                                            showId={displayProperties.showId}
                                            showStatusIcon={displayProperties.showStatusIcon}
                                        />
                                    ))}
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={60} minSize={40}>
                    <InboxPreview item={selectedItem} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </WorkspaceLayout>
    );
}
