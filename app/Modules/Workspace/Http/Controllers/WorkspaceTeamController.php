<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Http\Requests\Team\InviteTeamMemberRequest;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueLabel;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceTeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $teams = Team::query()
            ->withCount('issues')
            ->with('members', 'leads')
            ->get()
            ->each(function ($team) {
                $team->joined = $team->isMember(auth()->user());
                $team->role = $team->getRoleForUser(auth()->user());
            });

        $pendingInvitations = TeamInvitation::query()
            ->forUser(auth()->user())
            ->pending()
            ->notExpired()
            ->with(['team', 'inviter'])
            ->latest()
            ->get();

        return Inertia::render('workspace/teams/index', [
            'teams' => $teams->toResourceCollection(),
            'pendingInvitations' => $pendingInvitations,
        ]);
    }

    public function issues(Team $team, Request $request): Response
    {
        $this->authorize('view', $team);

        $query = Issue::query()
            ->withFullRelations()
            ->where('team_id', $team->id)
            ->orderBy('rank');

        if ($request->has('status')) {
            $query->whereHas('status', fn ($q) => $q->where('slug', $request->status));
        }

        if ($request->has('priority')) {
            $query->whereHas('priority', fn ($q) => $q->where('slug', $request->priority));
        }

        $issues = $query->get();

        return Inertia::render('workspace/teams/issues', [
            'team' => $team->load('members', 'leads')->toResource(),
            'issues' => $issues->toResourceCollection(),
            'statuses' => IssueStatus::orderBy('position')->get()->toResourceCollection(),
            'priorities' => IssuePriority::orderBy('order')->get()->toResourceCollection(),
            'labels' => IssueLabel::all()->toResourceCollection(),
            'filters' => $request->only(['status', 'priority']),
            'isLead' => $team->isLead(auth()->user()),
            'isMember' => $team->isMember(auth()->user()),
        ]);
    }

    public function members(Team $team): Response
    {
        return Inertia::render('workspace/teams/members', [
            'team' => $team->load('members', 'leads')->toResource(),
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Team $team)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        //
    }

    /**
     * Invite a user to the team.
     */
    public function invite(Team $team, InviteTeamMemberRequest $request)
    {
        $this->authorize('manage-members', $team);

        $invitation = app(\App\Modules\Workspace\Actions\InviteTeamMember::class)->handle(
            $team,
            $request->validated(),
            auth()->user()
        );

        return back();
    }

    /**
     * Leave the team.
     */
    public function leave(Team $team)
    {
        $this->authorize('leave', $team);

        $user = auth()->user();

        if ($team->isLead($user) && $team->leads()->count() === 1) {
            return back()->withErrors([
                'team' => 'Vous ne pouvez pas quitter l\'équipe car vous êtes le seul lead. Veuillez d\'abord transférer votre rôle à un autre membre.',
            ]);
        }

        $team->removeMember($user);

        $workspaceService = app(\App\Modules\Workspace\Services\WorkspaceService::class);
        $workspaceService->clearUserTeamsCache($user);
        $workspaceService->clearWorkspaceMembersCache();

        return redirect()->route('workspace.index')->with('success', 'Vous avez quitté l\'équipe avec succès');
    }
}
