<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InboxItemResource extends JsonResource
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
            'type' => $this->type,
            'content' => $this->content,
            'read' => $this->read,
            'readAt' => $this->read_at?->toISOString(),
            'snoozedUntil' => $this->snoozed_until?->toISOString(),
            'issue' => $this->whenLoaded('issue', fn () => new IssueResource($this->issue)),
            'actor' => $this->whenLoaded('actor', fn () => [
                'id' => $this->actor->id,
                'name' => $this->actor->name,
                'email' => $this->actor->email,
                'avatar_url' => $this->actor->avatar_url,
            ]),
            'createdAt' => $this->created_at->toISOString(),
        ];
    }
}
