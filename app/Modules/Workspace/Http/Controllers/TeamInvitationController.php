<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Models\TeamInvitation;
use App\Modules\Workspace\Services\WorkspaceService;

class TeamInvitationController extends Controller
{
    public function __construct(private WorkspaceService $workspaceService) {}

    /**
     * Accept a team invitation.
     */
    public function accept(TeamInvitation $invitation)
    {
        $user = auth()->user();

        if ($invitation->user_id !== $user->id) {
            abort(403, "Vous n'avez pas été invité à rejoindre cette équipe.");
        }

        try {
            $invitation->accept();

            $this->workspaceService->clearUserTeamsCache($user);
            $this->workspaceService->clearWorkspaceMembersCache();

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                'invitation' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Decline a team invitation.
     */
    public function decline(TeamInvitation $invitation)
    {
        $user = auth()->user();

        if ($invitation->user_id !== $user->id) {
            abort(403, 'Cette invitation ne vous appartient pas.');
        }

        try {
            $invitation->decline();

            return back()->with('success', 'Vous avez refusé l\'invitation');
        } catch (\Exception $e) {
            return back()->withErrors([
                'invitation' => $e->getMessage(),
            ]);
        }
    }
}
