<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Category */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $childrenProductCount = collect($this->whenLoaded('childrenRecursive'))->sum('products_count');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'parent' => CategoryResource::make($this->whenLoaded('parent')),
            'children' => CategoryResource::collection($this->whenLoaded('childrenRecursive')),
            'is_active' => $this->when(isset($this->status), $this->status?->value === 'active'),
            'products_count' => $this->when($this->parent_id, $this->products_count ?? 0),
            'total_products_count' => $this->when(!$this->parent_id, $childrenProductCount),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
