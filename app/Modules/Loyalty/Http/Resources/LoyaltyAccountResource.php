<?php

namespace App\Modules\Loyalty\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Modules\Loyalty\Http\Resources\LoyaltyTransactionResource;

class LoyaltyAccountResource extends JsonResource
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
            'user_id' => $this->user_id,
            'user' => UserResource::make($this->whenLoaded('user')),
            'points' => $this->points,
            'lifetime_points' => $this->lifetime_points,
            'available_points' => $this->available_points ?? $this->points,
            'expiring_points' => $this->expiring_points,
            'transactions' => LoyaltyTransactionResource::collection($this->whenLoaded('transactions')),
            'updated_at' => $this->updated_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm:ss'),
            'created_at' => $this->created_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm:ss'),
        ];
    }
}
