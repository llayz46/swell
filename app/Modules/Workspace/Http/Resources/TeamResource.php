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
            'members' => $this->whenLoaded('members', fn () => TeamMemberResource::collection($this->members)),
            'leads' => $this->whenLoaded('leads', fn () => TeamMemberResource::collection($this->leads)),
            'membersCount' => $this->when(isset($this->members_count), $this->members_count),
            'issuesCount' => $this->when(isset($this->issues_count), $this->issues_count),
            'role' => $this->when($this->joined, $this->getRoleForUser(auth()->user())),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
