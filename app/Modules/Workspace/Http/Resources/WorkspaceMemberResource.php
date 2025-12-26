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
                    'joined_at' => $team->pivot->joined_at,
                ]);
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
