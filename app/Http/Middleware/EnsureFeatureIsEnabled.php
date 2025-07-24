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
            throw new NotFoundHttpException("La fonctionnalité [{$feature}] est désactivée.");
        }

        return $next($request);
    }
}
