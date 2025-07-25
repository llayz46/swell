<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EnsureFeatureIsEnabled
{
    public function handle(Request $request, Closure $next, string $feature)
    {
        if (!config("swell.{$feature}.enabled", false)) {
            return inertia()->render('errors/feature-disabled', [
                'feature' => $feature,
            ])->toResponse($request)->setStatusCode(403);
        }

        return $next($request);
    }
}
