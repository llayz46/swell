<?php

namespace App\Modules\Workspace;

use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Policies\IssuePolicy;
use App\Modules\Workspace\Policies\TeamPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class WorkspaceServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/database/migrations');

        $this->publishes([
            __DIR__.'/database/migrations' => database_path('migrations'),
        ], 'swell-workspace');

        if (! config('swell.workspace.enabled', false)) {
            return;
        }

        $this->registerPolicies();
    }

    /**
     * Register the workspace policies.
     */
    protected function registerPolicies(): void
    {
        Gate::policy(Issue::class, IssuePolicy::class);
        Gate::policy(Team::class, TeamPolicy::class);
    }
}
