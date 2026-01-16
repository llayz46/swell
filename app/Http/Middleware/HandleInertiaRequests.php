<?php

namespace App\Http\Middleware;

use App\Services\SharedPropsService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(private SharedPropsService $sharedPropsService) {}

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
        $shared = [
            ...parent::share($request),
            'name' => config('app.name'),
            'swell' => fn () => $this->sharedPropsService->getSwellConfig(),
            'auth' => fn () => $this->sharedPropsService->getAuthData($request),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'categories' => fn () => $this->sharedPropsService->getCategories(),
            'cart' => fn () => $this->sharedPropsService->getCart(),
        ];

        if (config('swell.banner.enabled', true)) {
            $shared['infoBanner'] = fn () => $this->sharedPropsService->getInfoBanner();
        }

        if (config('swell.workspace.enabled', true)) {
            $shared['workspaceMembers'] = fn () => $this->sharedPropsService->getWorkspaceMembers($request);
            $shared['invitableTeams'] = fn () => $this->sharedPropsService->getInvitableTeams($request);
        }

        return $shared;
    }
}
