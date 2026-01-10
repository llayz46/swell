<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueStatusResource extends JsonResource
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
            'slug' => $this->slug,
            'name' => $this->name,
            'color' => $this->color,
            'icon_type' => $this->icon_type,
            'order' => $this->order,
            'issues' => $this->whenLoaded('issues', fn () => $this->issues->toResourceCollection()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
