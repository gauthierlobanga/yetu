<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Headers de sécurité à ajouter à toutes les réponses.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // HSTS (Strict-Transport-Security) — uniquement en production avec HTTPS
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        $csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "font-src 'self' data: https://fonts.bunny.net https://fonts.gstatic.com",
            "connect-src 'self' ws: wss: https://api.stripe.com",
            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
            "media-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ];

        if (app()->environment('local')) {
            $csp[1] .= " http://localhost:5173 http://127.0.0.1:5173 http://[::1]:5173";
            $csp[2] .= " http://localhost:5173 http://127.0.0.1:5173 http://[::1]:5173";
            $csp[5] .= " http://localhost:5173 http://127.0.0.1:5173 http://[::1]:5173 ws://localhost:5173 ws://127.0.0.1:5173 ws://[::1]:5173";
        }

        $response->headers->set('Content-Security-Policy', implode('; ', $csp) . ';');

        return $response;
    }
}
