<?php

namespace App\Modules\Loyalty\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Loyalty\Models\LoyaltyAccount;
use App\Modules\Loyalty\Services\LoyaltyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoyaltyController extends Controller
{
    public function __construct(
        protected LoyaltyService $loyaltyService
    ) {}

    /**
     * Display loyalty accounts overview
     */
    public function index(): Response
    {
        $accounts = LoyaltyAccount::with('user')
            ->withCount('transactions')
            ->orderBy('points', 'desc')
            ->paginate(20);

        return Inertia::render('admin/loyalty/index', [
            'accounts' => $accounts->through(fn($account) => [
                'id' => $account->id,
                'user' => [
                    'id' => $account->user->id,
                    'name' => $account->user->name,
                    'email' => $account->user->email,
                ],
                'points' => $account->points,
                'lifetime_points' => $account->lifetime_points,
                'transactions_count' => $account->transactions_count,
                'created_at' => $account->created_at->format('d/m/Y'),
            ]),
            'stats' => [
                'total_accounts' => LoyaltyAccount::count(),
                'total_points' => LoyaltyAccount::sum('points'),
                'total_lifetime_points' => LoyaltyAccount::sum('lifetime_points'),
            ],
        ]);
    }

    /**
     * Show user's loyalty account details
     */
    public function show(LoyaltyAccount $loyaltyAccount): Response
    {
        $loyaltyAccount->load('user', 'transactions');

        return Inertia::render('admin/loyalty/show', [
            'account' => [
                'id' => $loyaltyAccount->id,
                'user' => [
                    'id' => $loyaltyAccount->user->id,
                    'name' => $loyaltyAccount->user->name,
                    'email' => $loyaltyAccount->user->email,
                ],
                'points' => $loyaltyAccount->points,
                'lifetime_points' => $loyaltyAccount->lifetime_points,
                'available_points' => $loyaltyAccount->available_points,
                'expiring_points' => $loyaltyAccount->expiring_points,
            ],
            'transactions' => $loyaltyAccount->transactions()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($transaction) => [
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
        ]);
    }

    /**
     * Adjust user's points (admin action)
     */
    public function adjust(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'points' => 'required|integer',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->loyaltyService->adminAdjustment(
                $user,
                $request->integer('points'),
                $request->string('reason')->toString()
            );

            return back()->with('success', 'Points ajustés avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Expire old points (manual trigger)
     */
    public function expirePoints(): RedirectResponse
    {
        try {
            $count = $this->loyaltyService->expirePoints();

            return back()->with('success', "{$count} transaction(s) de points expirés traitée(s)");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
