<?php

namespace App\Modules\Loyalty\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Loyalty\Models\LoyaltyAccount;
use App\Modules\Loyalty\Services\LoyaltyService;
use App\Modules\Loyalty\Http\Resources\LoyaltyAccountResource;
use App\Modules\Loyalty\Http\Resources\LoyaltyTransactionResource;
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
            
        $stats = LoyaltyAccount::selectRaw('
            COUNT(*) as total_accounts,
            SUM(points) as total_points,
            SUM(lifetime_points) as total_lifetime_points
        ')->first();

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
                'total_accounts' => $stats->total_accounts,
                'total_points' => $stats->total_points,
                'total_lifetime_points' => $stats->total_lifetime_points,
            ],
        ]);
    }

    /**
     * Show user's loyalty account details
     */
    public function show(LoyaltyAccount $loyaltyAccount): Response
    {
        $loyaltyAccount->load([
            'user:id,name,email',
            'transactions' => function ($query) {
                $query->orderBy('created_at', 'desc')
                      ->with('order:id,order_number');
            }
        ]);

        return Inertia::render('admin/loyalty/show', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Points de fidélité', 'href' => route('admin.loyalty.index')],
                ['title' => $loyaltyAccount->user->name, 'href' => route('admin.loyalty.show', $loyaltyAccount)],
            ],
            'account' => LoyaltyAccountResource::make($loyaltyAccount),
            'transactions' => LoyaltyTransactionResource::collection($loyaltyAccount->transactions),
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
