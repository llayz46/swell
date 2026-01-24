<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', config('app.available_locales'))],
        ]);

        $cookie = cookie('locale', $validated['locale'], 60 * 24 * 365);

        return back()->withCookie($cookie);
    }
}
