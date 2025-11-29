<?php

namespace App\Modules\Loyalty\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Loyalty\Services\LoyaltyService;
use App\Modules\Loyalty\Http\Resources\LoyaltyAccountResource;
use App\Modules\Loyalty\Http\Resources\LoyaltyTransactionResource;
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
    public function index(): Response
    {
        $user = auth()->user();

        $loyaltyAccount = $this->loyaltyService->getOrCreateAccount($user);
        $loyaltyAccount->load([
            'user:id,name,email',
            'transactions' => function ($query) {
                $query->orderBy('created_at', 'desc')
                      ->with('order:id,order_number');
            }
        ]);
        
        return Inertia::render('loyalty/index', [
            'account' => LoyaltyAccountResource::make($loyaltyAccount),
            'transactions' => LoyaltyTransactionResource::collection($loyaltyAccount->transactions),
            'config' => [
                'points_per_euro' => config('swell.loyalty.points_per_euro'),
                'minimum_redeem_points' => config('swell.loyalty.minimum_redeem_points'),
                'max_discount_percentage' => config('swell.loyalty.max_discount_percentage'),
            ],
        ]);
    }
}
