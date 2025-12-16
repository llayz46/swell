<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Models\Team;
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

        return Inertia::render('workspace/teams/index', [
            'teams' => $teams->toResourceCollection()
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
}
