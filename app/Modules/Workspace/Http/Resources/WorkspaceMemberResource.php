<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceMemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url ?? null,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles
                    ->filter(fn ($role) => str_starts_with($role->name, 'team-') || str_starts_with($role->name, 'workspace-'))
                    ->pluck('name')
                    ->values();
            }),
            'workspaceRole' => $this->getWorkspaceDisplayRole(),
            'teams' => $this->whenLoaded('teams', function () {
                return $this->teams->map(fn ($team) => [
                    'id' => $team->id,
                    'identifier' => $team->identifier,
                    'name' => $team->name,
                    'icon' => $team->icon,
                    'color' => $team->color,
                    'joined_at' => $team->pivot->joined_at,
                ]);
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    /**
     * Get the workspace display role for this member.
     *
     * Priority:
     * 1. workspace-admin (Spatie role)
     * 2. team-lead (if lead in at least one team)
     * 3. team-member (default)
     */
    private function getWorkspaceDisplayRole(): string
    {
        if ($this->isWorkspaceAdmin()) {
            return 'workspace-admin';
        }

        if ($this->relationLoaded('teams')) {
            $hasLeadRole = $this->teams->contains(function ($team) {
                return $team->pivot->role === 'team-lead';
            });

            if ($hasLeadRole) {
                return 'team-lead';
            }
        }

        return 'team-member';
    }
}
