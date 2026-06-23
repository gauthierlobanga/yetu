<?php

namespace App\Http\Controllers\Others;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    /**
     * Update user preferences (country, currency, locale).
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'country' => ['nullable', 'string', 'size:2'],
            'currency' => ['nullable', 'string', 'size:3'],
            'locale' => ['nullable', 'string', 'size:2'],
        ]);

        // Save to session
        if ($request->filled('country')) {
            session(['country' => strtoupper($validated['country'])]);
        }

        if ($request->filled('currency')) {
            session(['currency' => strtoupper($validated['currency'])]);
        }

        if ($request->filled('locale')) {
            session(['locale' => strtolower($validated['locale'])]);
        }

        // If authenticated, save to database
        if (Auth::check()) {
            $user = Auth::user();

            if ($request->filled('country')) {
                $user->setPreference('country', strtoupper($validated['country']));
            }
            if ($request->filled('currency')) {
                $user->setPreference('currency', strtoupper($validated['currency']));
            }
            if ($request->filled('locale')) {
                $user->setPreference('locale', strtolower($validated['locale']));
            }
        }

        return back();
    }
}
