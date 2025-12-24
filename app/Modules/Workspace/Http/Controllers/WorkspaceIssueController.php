<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Http\Requests\Issue\StoreIssueRequest;
use App\Modules\Workspace\Http\Requests\Issue\UpdateIssueAssigneeRequest;
use App\Modules\Workspace\Http\Requests\Issue\UpdateIssueDueDateRequest;
use App\Modules\Workspace\Http\Requests\Issue\UpdateIssueLabelRequest;
use App\Modules\Workspace\Http\Requests\Issue\UpdateIssuePriorityRequest;
use App\Modules\Workspace\Http\Requests\Issue\UpdateIssueStatusRequest;
use App\Modules\Workspace\Models\Issue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceIssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('workspace/issues/index', [
            'issues' => Issue::paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIssueRequest $request)
    {
        $this->authorize('create', Issue::class);

        $validated = $request->validated();

        $issue = Issue::create([
            ...$validated,
            'identifier' => Issue::generateIdentifier(),
            'creator_id' => auth()->id(),
            'rank' => $this->generateNextRank(),
        ]);

        if (! empty($validated['label_ids'])) {
            $issue->labels()->attach($validated['label_ids']);
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Issue $issue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Issue $issue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Issue $issue)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Issue $issue)
    {
        $this->authorize('delete', $issue);

        $issue->delete();

        return back();
    }

    /**
     * Update the priority of the specified issue.
     */
    public function updatePriority(UpdateIssuePriorityRequest $request, Issue $issue)
    {
        $this->authorize('update', $issue);

        $validated = $request->validated();

        $issue->update([
            'priority_id' => $validated['priority_id'],
        ]);

        return back();
    }

    /**
     * Update the status of the specified issue.
     */
    public function updateStatus(UpdateIssueStatusRequest $request, Issue $issue)
    {
        $this->authorize('update', $issue);

        $validated = $request->validated();

        $issue->update([
            'status_id' => $validated['status_id'],
        ]);

        return back();
    }

    /**
     * Update the assignee of the specified issue.
     */
    public function updateAssignee(UpdateIssueAssigneeRequest $request, Issue $issue)
    {
        $this->authorize('assign', $issue);

        $validated = $request->validated();

        $issue->update([
            'assignee_id' => $validated['assignee_id'],
        ]);

        return back();
    }

    /**
     * Update the labels of the specified issue.
     */
    public function updateLabel(UpdateIssueLabelRequest $request, Issue $issue)
    {
        $this->authorize('update', $issue);

        $labelId = $request->validated()['label_id'];

        if ($issue->labels()->where('issue_labels.id', $labelId)->exists()) {
            $issue->labels()->detach($labelId);
        } else {
            $issue->labels()->attach($labelId);
        }

        return back();
    }

    /**
     * Update the due date of the specified issue.
     */
    public function updateDueDate(UpdateIssueDueDateRequest $request, Issue $issue)
    {
        $this->authorize('update', $issue);

        $validated = $request->validated();

        $issue->update([
            'due_date' => $validated['due_date'],
        ]);

        return back();
    }

    private function generateNextRank(): string
    {
        // Implémentation simplifiée, à remplacer par LexoRank si nécessaire
        $maxRank = Issue::max('rank');

        return (string) ((int) $maxRank + 1);
    }
}
