<?php

namespace App\Modules\Workspace\Services;

use App\Models\User;
use App\Modules\Workspace\Http\Resources\TeamResource;
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
                ->get();

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
}
