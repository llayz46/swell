<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Workspace\Http\Resources\WorkspaceMemberResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceMembersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $members = User::query()
            ->whereHas('roles', fn($q) => $q->whereIn('name', ['workspace-admin', 'team-lead', 'team-member']))
            ->with(['roles', 'teams'])
            ->get();

        return Inertia::render('workspace/members/index', [
            'members' => WorkspaceMemberResource::collection($members),
        ]);
    }
}
