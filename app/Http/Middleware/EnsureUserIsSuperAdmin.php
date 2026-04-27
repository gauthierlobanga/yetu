<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Vérification que l'utilisateur est connecté
        if (! $user) {
            Log::warning('Tentative d\'accès au panel admin par un utilisateur non authentifié.', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
            ]);

            return redirect()->route('login');
        }

        // Vérification des conditions : rôle Super Admin ET email se terminant par @admin.com
        if (! $user->hasRole('Super Admin')
            && (! str_ends_with($user->email, '@admin.com'))) {
            Log::info('Accès refusé au panel admin.', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'ip' => $request->ip(),
            ]);

            return redirect()->intended('/');
        }

        return $next($request);
    }
}
