<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Http\Resources\IssueResource;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueLabel;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceMyIssuesController extends Controller
{
    public function overview(): Response
    {
        $user = Auth::user();

        $issues = Issue::query()
            ->where('assignee_id', $user->id)
            ->withFullRelations()
            ->orderBy('updated_at', 'desc')
            ->get();

        $stats = $this->calculateStats($issues);

        return Inertia::render('workspace/my-issues/overview', [
            'issues' => IssueResource::collection($issues),
            'stats' => $stats,
        ]);
    }

    public function focus(Request $request): Response
    {
        $user = Auth::user();

        $issues = Issue::query()
            ->where('assignee_id', $user->id)
            ->withFullRelations()
            ->orderBy('updated_at', 'desc')
            ->get();

        $statuses = IssueStatus::query()->orderBy('order')->get();
        $priorities = IssuePriority::query()->orderBy('order')->get();
        $labels = IssueLabel::query()->orderBy('name')->get();

        return Inertia::render('workspace/my-issues/focus', [
            'issues' => IssueResource::collection($issues),
            'statuses' => $statuses,
            'priorities' => $priorities,
            'labels' => $labels,
            'selectedIssueId' => $request->query('issue'),
        ]);
    }

    /**
     * Calculate statistics for the user's issues.
     *
     * @param  \Illuminate\Database\Eloquent\Collection<int, Issue>  $issues
     * @return array{total: int, inProgress: int, overdue: int, completedThisWeek: int}
     */
    private function calculateStats($issues): array
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();

        $total = $issues->count();

        $inProgress = $issues->filter(fn ($issue) => $issue->status->slug === 'in-progress')->count();

        $overdue = $issues->filter(function ($issue) use ($today) {
            if (! $issue->due_date) {
                return false;
            }

            $dueDate = Carbon::parse($issue->due_date)->startOfDay();

            return $dueDate->lt($today)
                && ! in_array($issue->status->slug, ['done', 'cancelled']);
        })->count();

        $completedThisWeek = $issues->filter(function ($issue) use ($startOfWeek) {
            return $issue->status->slug === 'done'
                && $issue->updated_at->gte($startOfWeek);
        })->count();

        return [
            'total' => $total,
            'inProgress' => $inProgress,
            'overdue' => $overdue,
            'completedThisWeek' => $completedThisWeek,
        ];
    }
}
