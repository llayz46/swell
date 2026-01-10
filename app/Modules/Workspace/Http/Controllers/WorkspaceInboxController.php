<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Http\Resources\InboxItemResource;
use App\Modules\Workspace\Models\InboxItem;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceInboxController extends Controller
{
    /**
     * Display the workspace inbox.
     */
    public function index(Request $request): Response
    {
        $items = InboxItem::query()
            ->forUser($request->user()->id)
            ->withFullRelations()
            ->latest()
            ->get();

        return Inertia::render('workspace/inbox/index', [
            'items' => InboxItemResource::collection($items),
        ]);
    }

    /**
     * Mark an inbox item as read.
     */
    public function markAsRead(InboxItem $inboxItem): RedirectResponse
    {
        $this->authorize('update', $inboxItem);

        $inboxItem->markAsRead();

        return back();
    }

    /**
     * Mark an inbox item as unread.
     */
    public function markAsUnread(InboxItem $inboxItem): RedirectResponse
    {
        $this->authorize('update', $inboxItem);

        $inboxItem->markAsUnread();

        return back();
    }

    /**
     * Mark all inbox items as read for the current user.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        InboxItem::query()
            ->forUser($request->user()->id)
            ->unread()
            ->update([
                'read' => true,
                'read_at' => now(),
            ]);

        return back();
    }

    /**
     * Snooze an inbox item until a specific time.
     */
    public function snooze(Request $request, InboxItem $inboxItem): RedirectResponse
    {
        $this->authorize('update', $inboxItem);

        $validated = $request->validate([
            'until' => ['required', 'date', 'after:now'],
        ]);

        $inboxItem->snooze(Carbon::parse($validated['until']));

        return back();
    }

    /**
     * Remove snooze from an inbox item.
     */
    public function unsnooze(InboxItem $inboxItem): RedirectResponse
    {
        $this->authorize('update', $inboxItem);

        $inboxItem->unsnooze();

        return back();
    }

    /**
     * Delete a single inbox item.
     */
    public function destroy(InboxItem $inboxItem): RedirectResponse
    {
        $this->authorize('delete', $inboxItem);

        $inboxItem->delete();

        return back();
    }

    /**
     * Delete all inbox items for the current user.
     */
    public function destroyAll(Request $request): RedirectResponse
    {
        InboxItem::query()
            ->forUser($request->user()->id)
            ->delete();

        return back();
    }

    /**
     * Delete all read inbox items for the current user.
     */
    public function destroyRead(Request $request): RedirectResponse
    {
        InboxItem::query()
            ->forUser($request->user()->id)
            ->where('read', true)
            ->delete();

        return back();
    }
}
