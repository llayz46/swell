<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
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
            'identifier' => $this->identifier,
            'name' => $this->name,
            'icon' => $this->icon,
            'color' => $this->color,
            'description' => $this->description,
            'joined' => $this->when(isset($this->joined), $this->joined),
            'members' => $this->whenLoaded('members', function () {
                return $this->members->map(fn($member) => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatarUrl' => $member->avatar_url ?? null,
                    'role' => $member->pivot->role,
                    'joinedAt' => $member->pivot->joined_at,
                ]);
            }),
            'leads' => $this->whenLoaded('leads', function () {
                return $this->leads->map(fn($lead) => [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'avatarUrl' => $lead->avatar_url ?? null,
                ]);
            }),
            'membersCount' => $this->when(isset($this->members_count), $this->members_count),
            'issuesCount' => $this->when(isset($this->issues_count), $this->issues_count),
            'role' => $this->when($this->joined, $this->getRoleForUser(auth()->user())),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
