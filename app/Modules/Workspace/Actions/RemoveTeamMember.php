<?php

namespace App\Modules\Workspace\Actions;

use App\Models\User;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Services\WorkspaceService;
use Illuminate\Support\Facades\DB;

class RemoveTeamMember
{
    public function __construct(
        private WorkspaceService $workspaceService
    ) {}

    /**
     * Remove a member from a team and unassign their issues.
     */
    public function handle(Team $team, User $user): void
    {
        DB::transaction(function () use ($team, $user) {
            $team->issues()
                ->where('assignee_id', $user->id)
                ->update(['assignee_id' => null]);

            $team->members()->detach($user->id);
        });

        // Invalider le cache des équipes de l'utilisateur
        $this->workspaceService->clearUserTeamsCache($user);
    }
}
