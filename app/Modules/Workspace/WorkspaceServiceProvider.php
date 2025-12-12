<?php

namespace App\Modules\Workspace;

use Illuminate\Support\ServiceProvider;

class WorkspaceServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
        
        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'swell-workspace');

        if (!config('swell.workspace.enabled', false)) return;
    }
}