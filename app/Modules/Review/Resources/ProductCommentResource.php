<?php

namespace App\Modules\Review\Resources;

use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Modules\Review\Models\ProductComment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProductComment */
class ProductCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'comment' => $this->comment,
            'rating' => $this->rating,
            'user_id' => $this->user_id,
            'product_id' => $this->product_id,

            'user' => UserResource::make($this->whenLoaded('user')),
            'product' => ProductResource::make($this->whenLoaded('product')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
