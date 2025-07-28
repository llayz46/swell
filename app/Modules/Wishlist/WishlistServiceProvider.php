<?php

namespace App\Modules\Wishlist;

use Illuminate\Support\ServiceProvider;

class WishlistServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (!config('swell.wishlist.enabled', false)) return;

        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-wishlist');
    }

    public static function getPublishedFiles(): array
    {
        return [
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ];
    }
}
