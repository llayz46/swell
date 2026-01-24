<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = config('app.available_locales', ['fr', 'en']);
        $defaultLocale = config('app.locale', 'fr');

        $locale = $request->cookie('locale');

        if (!$locale || !in_array($locale, $availableLocales)) {
            $locale = $request->getPreferredLanguage($availableLocales);
        }

        if (!$locale || !in_array($locale, $availableLocales)) {
            $locale = $defaultLocale;
        }

        App::setLocale($locale);

        return $next($request);
    }
}
