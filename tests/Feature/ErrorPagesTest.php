<?php

use Symfony\Component\HttpKernel\Exception\HttpException;

it('uses the modern not found page for missing routes', function () {
    config()->set('app.debug', false);

    $this->get('/missing-modern-error-page')
        ->assertNotFound()
        ->assertSee('error-shell')
        ->assertSee('Page introuvable');
});

it('renders the modern error layout for every Laravel error page', function (string $view, string $code, string $message) {
    view()->addNamespace('errors', resource_path('views/errors'));

    $html = view("errors::{$view}", [
        'exception' => new HttpException((int) $code, $message),
    ])->render();

    expect($html)
        ->toContain('error-shell')
        ->toContain("Erreur {$code}")
        ->toContain($message)
        ->toContain('Prochaines actions')
        ->toContain('Aide disponible')
        ->toContain('mailto:support@yetu.cd');
})->with([
    '401' => ['401', '401', 'Connexion requise'],
    '402' => ['402', '402', 'Paiement requis'],
    '403' => ['403', '403', 'Accès refusé'],
    '404' => ['404', '404', 'Page introuvable'],
    '419' => ['419', '419', 'Session expirée'],
    '429' => ['429', '429', 'Trop de requêtes'],
    '500' => ['500', '500', 'Quelque chose s’est arrêté'],
    '503' => ['503', '503', 'Service momentanément indisponible'],
]);
