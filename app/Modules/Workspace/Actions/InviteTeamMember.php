<?php

namespace App\Modules\Workspace\Actions;

use App\Models\User;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
use App\Modules\Workspace\Services\WorkspaceService;
use Carbon\Carbon;

class InviteTeamMember
{
    public function __construct(
        private WorkspaceService $workspaceService
    ) {}

    /**
     * Create a team invitation for a user.
     *
     * @param  array{user_id: int, role: string, message?: string|null}  $data
     */
    public function handle(Team $team, array $data, User $inviter): TeamInvitation
    {
        $invitation = TeamInvitation::create([
            'team_id' => $team->id,
            'user_id' => $data['user_id'],
            'invited_by' => $inviter->id,
            'role' => $data['role'],
            'message' => $data['message'] ?? null,
            'status' => 'pending',
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        $this->workspaceService->clearWorkspaceMembersCache();

        // TODO: Envoyer une notification/email à l'utilisateur invité
        // Notification::send($user, new TeamInvitationNotification($invitation));

        return $invitation;
    }
}
