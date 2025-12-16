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
            'avatarUrl' => $this->avatar_url ?? null,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles
                    ->filter(fn($role) => str_starts_with($role->name, 'team-') || str_starts_with($role->name, 'workspace-'))
                    ->pluck('name')
                    ->values();
            }),
            'teams' => $this->whenLoaded('teams', function () {
                return $this->teams->map(fn($team) => [
                    'id' => $team->id,
                    'identifier' => $team->identifier,
                    'name' => $team->name,
                    'icon' => $team->icon,
                    'color' => $team->color,
                    'joinedAt' => $team->pivot->joined_at,
                ]);
            }),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
