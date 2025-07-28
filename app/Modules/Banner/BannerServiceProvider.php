<?php

namespace App\Modules\Banner;

use Illuminate\Support\ServiceProvider;

class BannerServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (!config('swell.banner.enabled', false)) return;

        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-banner');
    }

    public static function getPublishedFiles(): array
    {
        return [
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ];
    }
}
