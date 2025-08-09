<?php

namespace App\Modules\Review;

use Illuminate\Support\ServiceProvider;

class ReviewServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (!config('swell.review.enabled', false)) return;

        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-review');
    }
}
