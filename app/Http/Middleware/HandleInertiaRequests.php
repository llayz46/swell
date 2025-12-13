<?php

namespace App\Http\Middleware;

use App\Factories\CartFactory;
use App\Http\Resources\CartResource;
use App\Http\Resources\CategoryResource;
use App\Modules\Banner\Models\BannerMessage;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'swell' => fn () => Cache::rememberForever('swell_config', function () {
                return [
                    'wishlist' => [
                        'enabled' => config('swell.wishlist.enabled', true),
                    ],
                    'banner' => [
                        'enabled' => config('swell.banner.enabled', true),
                    ],
                    'review' => [
                        'enabled' => config('swell.review.enabled', true),
                    ],
                    'loyalty' => [
                        'enabled' => config('swell.loyalty.enabled', false),
                        'points_per_euro' => config('swell.loyalty.points_per_euro', 10),
                        'minimum_redeem_points' => config('swell.loyalty.minimum_redeem_points', 100),
                    ],
                    'workspace' => [
                        'enabled' => config('swell.workspace.enabled', true),
                    ]
                ];
            }),
            'auth' => [
                'user' => fn () => $request->user()?->load('roles'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'categories' => fn () => Cache::rememberForever('categories', fn () => CategoryResource::collection(Category::with(['childrenRecursive' => fn($q) => $q->withCount('products')])->withCount('products')->whereNull('parent_id')->get())),
            'cart' => fn () => Cache::remember("cart-" . (auth()->check() ? 'user-' . auth()->id() : 'session-' . session()->getId()), 30, function () {
                return CartResource::make(CartFactory::make()->load('items.product.images', 'items.product.brand', 'items.product.options.values'));
            }),
            'infoBanner' => fn () => config('swell.banner.enabled', true) ? Cache::rememberForever('infoBanner', fn () => BannerMessage::orderBy('order')->get()) : [],
        ];
    }
}
