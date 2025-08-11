<?php

namespace App\Modules\Review;

use Illuminate\Support\ServiceProvider;

class ReviewServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-review');

        if (!config('swell.review.enabled', false)) return;
    }
}
