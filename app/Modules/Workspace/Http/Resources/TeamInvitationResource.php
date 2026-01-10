<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamInvitationResource extends JsonResource
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
            'team' => [
                'id' => $this->team->id,
                'identifier' => $this->team->identifier,
                'name' => $this->team->name,
                'icon' => $this->team->icon,
                'color' => $this->team->color,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar_url' => $this->user->avatar,
            ],
            'inviter' => [
                'id' => $this->inviter->id,
                'name' => $this->inviter->name,
                'avatar_url' => $this->inviter->avatar,
            ],
            'role' => $this->role,
            'message' => $this->message,
            'status' => $this->status,
            'is_pending' => $this->isPending(),
            'is_expired' => $this->isExpired(),
            'expires_at' => $this->expires_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
