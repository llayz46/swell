<?php

namespace App\Services;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryCacheService
{
    /**
     * Get cached categories with product counts.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getCachedCategories()
    {
        return Cache::rememberForever('categories', function () {
            $categories = Category::with([
                'childrenRecursive' => fn($q) => $q->withCount('products')
            ])
                ->withCount('products')
                ->whereNull('parent_id')
                ->get();

            return CategoryResource::collection($categories);
        });
    }

    /**
     * Clear the categories cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget('categories');
    }

    /**
     * Refresh the categories cache.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function refreshCache()
    {
        $this->clearCache();
        return $this->getCachedCategories();
    }
}
