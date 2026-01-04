<?php

namespace App\Modules\Workspace\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueLabelResource extends JsonResource
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
            'issues' => $this->whenLoaded('issues', fn () => $this->issues->toResourceCollection()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
