<?php

namespace App\Modules\Loyalty;

use Illuminate\Support\ServiceProvider;

class LoyaltyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-loyalty');

        if (!config('swell.loyalty.enabled', false)) return;
    }

    public function register(): void
    {
        // Register loyalty service
        $this->app->singleton(\App\Modules\Loyalty\Services\LoyaltyService::class);
    }
}
