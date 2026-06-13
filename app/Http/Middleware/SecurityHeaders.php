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

        // Content-Security-Policy de base
        $response->headers->set('Content-Security-Policy',
            "default-src 'self'; ".
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; ".
            "style-src 'self' 'unsafe-inline'; ".
            "img-src 'self' data: https:; ".
            "font-src 'self' data:; ".
            "connect-src 'self' ws: wss: https://api.stripe.com; ".
            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; ".
            "media-src 'self'; ".
            "object-src 'none'; ".
            "base-uri 'self'; ".
            "form-action 'self';"
        );

        return $response;
    }
}
