<?php

namespace App\Modules\Loyalty\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Loyalty\Services\LoyaltyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoyaltyController extends Controller
{
    public function __construct(
        protected LoyaltyService $loyaltyService
    ) {}

    /**
     * Display user's loyalty points and transaction history
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $account = $this->loyaltyService->getOrCreateAccount($user);
        $transactions = $this->loyaltyService->getTransactionHistory($user, 50);

        return Inertia::render('Loyalty/Index', [
            'account' => [
                'points' => $account->points,
                'lifetime_points' => $account->lifetime_points,
                'available_points' => $account->available_points,
                'expiring_points' => $account->expiring_points,
            ],
            'transactions' => $transactions->map(fn($transaction) => [
                'id' => $transaction->id,
                'type' => $transaction->type->value,
                'type_label' => $transaction->type->label(),
                'points' => $transaction->points,
                'balance_after' => $transaction->balance_after,
                'description' => $transaction->description,
                'order_number' => $transaction->order?->order_number,
                'expires_at' => $transaction->expires_at?->format('d/m/Y'),
                'created_at' => $transaction->created_at->format('d/m/Y H:i'),
            ]),
            'config' => [
                'points_per_euro' => config('swell.loyalty.points_per_euro'),
                'minimum_redeem_points' => config('swell.loyalty.minimum_redeem_points'),
                'max_discount_percentage' => config('swell.loyalty.max_discount_percentage'),
            ],
        ]);
    }
}
