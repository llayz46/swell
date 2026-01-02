<?php

namespace App\Modules\Workspace\Services;

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Http\Resources\TeamResource;
use App\Modules\Workspace\Http\Resources\WorkspaceMemberResource;
use Illuminate\Support\Facades\Cache;

class WorkspaceService
{
    /**
     * Get cached teams for the given user.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|null
     */
    public function getUserTeams(?User $user)
    {
        if (! $user) {
            return null;
        }

        return Cache::remember("user-teams-{$user->id}", 60, function () use ($user) {
            $teams = $user->teams()
                ->withCount('members', 'issues')
                ->get()
                ->each(function ($team) {
                    // L'utilisateur est forcément membre puisqu'on récupère SES équipes
                    $team->joined = true;
                });

            return TeamResource::collection($teams);
        });
    }

    /**
     * Clear the teams cache for a specific user.
     */
    public function clearUserTeamsCache(User $user): void
    {
        Cache::forget("user-teams-{$user->id}");
    }

    /**
     * Refresh the teams cache for a specific user.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function refreshUserTeams(User $user)
    {
        $this->clearUserTeamsCache($user);

        return $this->getUserTeams($user);
    }

    /**
     * Get cached workspace members (admins or users with at least one team).
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getWorkspaceMembers()
    {
        return Cache::remember('workspace-members', 60, function () {
            $members = User::query()
                ->where(function ($query) {
                    $query->whereHas('roles', fn ($q) => $q->where('name', WorkspaceRole::adminRole()))
                        ->orWhereHas('teams');
                })
                ->with(['roles', 'teams'])
                ->get();

            return WorkspaceMemberResource::collection($members);
        });
    }

    /**
     * Get workspace roles (static enum values).
     *
     * @return array<int, array{value: string, label: string}>
     */
    public function getWorkspaceRoles(): array
    {
        return WorkspaceRole::toArray();
    }

    /**
     * Clear the workspace members cache.
     */
    public function clearWorkspaceMembersCache(): void
    {
        Cache::forget('workspace-members');
    }

    /**
     * Get teams where user can invite members.
     *
     * For workspace-admin: all teams
     * For team-lead: only teams where they are lead
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|null
     */
    public function getInvitableTeams(?User $user)
    {
        if (! $user) {
            return null;
        }

        if ($user->isWorkspaceAdmin()) {
            return Cache::remember('invitable-teams-all', 60, function () {
                $teams = \App\Modules\Workspace\Models\Team::query()
                    ->withCount('members', 'issues')
                    ->get();

                return TeamResource::collection($teams);
            });
        }

        $teams = $user->teams()
            ->wherePivot('role', 'team-lead')
            ->withCount('members', 'issues')
            ->get()
            ->each(function ($team) {
                $team->joined = true;
            });

        return TeamResource::collection($teams);
    }

    /**
     * Clear all invitable teams caches.
     */
    public function clearInvitableTeamsCache(): void
    {
        Cache::forget('invitable-teams-all');
    }
}
