<?php

namespace App\Services;

use App\Factories\CartFactory;
use App\Http\Resources\CartResource;
use App\Modules\Banner\Models\BannerMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SharedPropsService
{
    public function __construct(
        private CategoryCacheService $categoryCacheService,
        private WorkspaceService $workspaceService,
    ) {}

    /**
     * Get Swell configuration from cache.
     */
    public function getSwellConfig(): array
    {
        return Cache::rememberForever('swell_config', function () {
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
                ],
            ];
        });
    }

    /**
     * Get authentication data with user teams.
     */
    public function getAuthData(Request $request): array
    {
        $user = $request->user()?->load('roles');

        return [
            'user' => $user,
            'isWorkspaceUser' => $user?->isWorkspaceUser() ?? false,
            'teams' => config('swell.workspace.enabled', true)
                ? $this->workspaceService->getUserTeams($user)
                : [],
        ];
    }

    /**
     * Get cached categories.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getCategories()
    {
        return $this->categoryCacheService->getCachedCategories();
    }

    /**
     * Get cart with cache.
     */
    public function getCart(): CartResource
    {
        $cacheKey = auth()->check()
            ? 'cart-user-'.auth()->id()
            : 'cart-session-'.session()->getId();

        return Cache::remember($cacheKey, 30, function () {
            return CartResource::make(
                CartFactory::make()->load('items.product.images', 'items.product.brand', 'items.product.options.values')
            );
        });
    }

    /**
     * Get info banner messages.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array
     */
    public function getInfoBanner()
    {
        if (! config('swell.banner.enabled', true)) {
            return [];
        }

        return Cache::rememberForever('infoBanner', function () {
            return BannerMessage::orderBy('order')->get();
        });
    }

    /**
     * Clear all Swell configuration caches.
     */
    public function clearAllCaches(): void
    {
        Cache::forget('swell_config');
        Cache::forget('infoBanner');
        $this->categoryCacheService->clearCache();
    }
}
