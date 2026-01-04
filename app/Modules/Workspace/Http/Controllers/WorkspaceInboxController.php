<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceInboxController extends Controller
{
    /**
     * Display the workspace inbox.
     */
    public function index(): Response
    {
        return Inertia::render('workspace/inbox/index');
    }
}
