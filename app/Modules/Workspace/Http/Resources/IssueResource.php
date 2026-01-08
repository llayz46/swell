<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->whenLoaded('status', fn () => [
                'id' => $this->status->id,
                'slug' => $this->status->slug,
                'name' => $this->status->name,
                'color' => $this->status->color,
                'icon_type' => $this->status->icon_type,
            ]),
            'priority' => $this->whenLoaded('priority', fn () => [
                'id' => $this->priority->id,
                'slug' => $this->priority->slug,
                'name' => $this->priority->name,
                'icon_type' => $this->priority->icon_type,
            ]),
            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
                'email' => $this->assignee->email,
                'avatar_url' => $this->assignee->avatar_url,
            ] : null),
            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'team' => $this->whenLoaded('team', fn () => [
                'id' => $this->team->id,
                'identifier' => $this->team->identifier,
                'name' => $this->team->name,
                'icon' => $this->team->icon,
                'color' => $this->team->color,
            ]),
            'labels' => $this->whenLoaded('labels', fn () => $this->labels->map(fn ($label) => [
                'id' => $label->id,
                'name' => $label->name,
                'slug' => $label->slug,
                'color' => $label->color,
            ])),
            'dueDate' => $this->due_date?->format('Y-m-d'),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
