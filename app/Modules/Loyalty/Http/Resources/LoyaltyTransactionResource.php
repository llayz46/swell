<?php

namespace App\Modules\Loyalty\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\OrderResource;

class LoyaltyTransactionResource extends JsonResource
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
            'loyalty_account_id' => $this->loyalty_account_id,
            'order_id' => $this->order_id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'points' => $this->points,
            'balance_after' => $this->balance_after,
            'description' => $this->description,
            'order_number' => $this->order?->order_number,
            'order' => OrderResource::make($this->whenLoaded('order')),
            'expires_at' => $this->expires_at?->locale('fr')->isoFormat('D MMMM Y'),
            'created_at' => $this->created_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm'),
            'updated_at' => $this->updated_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm:ss'),
        ];
    }
}
