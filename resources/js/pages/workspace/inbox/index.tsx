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
import { Switch } from '@/components/ui/switch';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { Head } from '@inertiajs/react';
import { Archive, ArrowUpDown, CheckCheck, MoreHorizontal, SlidersHorizontal, Trash2 } from 'lucide-react';

export default function Index() {
    return (
        <WorkspaceLayout>
            <Head title="Messagerie - Workspace" />

            <ResizablePanelGroup direction="horizontal" autoSaveId="inbox-panel-group" className="size-full">
                <ResizablePanel defaultSize={350} maxSize={500}>
                    <div className="flex h-10 items-center justify-between border-b border-border px-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Inbox</h2>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="xs">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete all notifications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CheckCheck className="mr-2 h-4 w-4" />
                                        Delete all read notifications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Delete notifications for completed issues
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="xs">
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
                                        Ordering
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem>Newest</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Oldest</DropdownMenuCheckboxItem>

                                    <DropdownMenuSeparator />

                                    <div className="space-y-3 p-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-snoozed" className="text-sm">
                                                Show snoozed
                                            </Label>
                                            <Switch id="show-snoozed" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-read" className="text-sm">
                                                Show read
                                            </Label>
                                            <Switch id="show-read" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-unread-first" className="text-sm">
                                                Show unread first
                                            </Label>
                                            <Switch id="show-unread-first" />
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuLabel>Display properties</DropdownMenuLabel>
                                    <div className="space-y-3 p-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-id" className="text-sm">
                                                ID
                                            </Label>
                                            <Switch id="show-id" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-status-icon" className="text-sm">
                                                Status and icon
                                            </Label>
                                            <Switch id="show-status-icon" />
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex h-[calc(100%-40px)] w-full flex-col items-center justify-start overflow-y-scroll pb-px">
                        {/*{filteredNotifications.map((notification) => (
                            <IssueLine
                                key={notification.id}
                                notification={notification}
                                isSelected={selectedNotification?.id === notification.id}
                                onClick={() => setSelectedNotification(notification)}
                                showId={showId}
                                showStatusIcon={showStatusIcon}
                            />
                        ))}*/}
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={350} maxSize={500}>
                    {/*<NotificationPreview notification={selectedNotification} onMarkAsRead={markAsRead} />*/}
                </ResizablePanel>
            </ResizablePanelGroup>
        </WorkspaceLayout>
    );
}
