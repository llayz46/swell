<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Services\WorkspaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceMembersController extends Controller
{
    public function __construct(private WorkspaceService $workspaceService) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('workspace/members/index', [
            'members' => $this->workspaceService->getWorkspaceMembers(),
        ]);
    }
}
