<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        Log::info('--- PROFILE UPDATE START ---', [
            'session_id' => session()->getId(),
            'auth_user_id' => Auth::id(),
            'auth_user_email' => Auth::user()?->email,
            'request_all' => $request->all(),
            'cookies' => $request->cookies->all(),
            'server' => $_SERVER['HOSTNAME'] ?? 'unknown',
        ]);

        $request->validated();

        $user->fill($request->safe()->except('avatar'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars');

            $user->avatar = $path;
        }

        $user->save();

        Log::info('--- PROFILE UPDATE AFTER SAVE ---', [
            'session_id' => session()->getId(),
            'saved_user_id' => $user->id,
            'saved_user_email' => $user->email,
            'auth_user_after_save' => Auth::id(),
            'cookies' => $request->cookies->all(),
        ]);

        Log::info('--- PROFILE UPDATE END ---', [
            'session_id' => session()->getId(),
            'auth_user_id_end' => Auth::id(),
        ]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
