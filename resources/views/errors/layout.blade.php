@php
    $statusCode = trim($__env->yieldContent('code', '500'));
    $statusTitle = trim($__env->yieldContent('title', __('Erreur')));
    $statusMessage = trim($__env->yieldContent('message', __('Une erreur est survenue')));
    $statusDescription = trim($__env->yieldContent('description', __('La requête n’a pas pu être traitée correctement.')));
    $appName = config('app.name', 'Yetu');
    $homeUrl = url('/');
    $refreshUrl = request()->fullUrl();
    $previousUrl = url()->previous();
    $canGoBack = $previousUrl && $previousUrl !== $refreshUrl;
    $supportEmail = 'support@yetu.cd';

    $tone = match ($statusCode) {
        '401', '403', '419', '429' => 'amber',
        '402' => 'sky',
        '500', '503' => 'rose',
        default => 'emerald',
    };

    $statusLabel = match ($statusCode) {
        '401' => __('Accès sécurisé'),
        '402' => __('Paiement à finaliser'),
        '403' => __('Autorisation requise'),
        '404' => __('Chemin introuvable'),
        '419' => __('Session expirée'),
        '429' => __('Rythme limité'),
        '500' => __('Incident serveur'),
        '503' => __('Maintenance active'),
        default => __('État inattendu'),
    };

    $nextSteps = match ($statusCode) {
        '401' => [
            __('Retournez à l’accueil pour relancer la connexion.'),
            __('Vérifiez le compte utilisé si cette page est privée.'),
            __('Contactez le support si l’accès devrait déjà être ouvert.'),
        ],
        '402' => [
            __('Finalisez le paiement ou vérifiez votre abonnement.'),
            __('Revenez ensuite sur cette page pour continuer.'),
            __('Le support peut vous aider si le paiement est déjà passé.'),
        ],
        '403' => [
            __('Revenez à une zone autorisée de votre espace.'),
            __('Demandez une autorisation si votre rôle a changé.'),
            __('Gardez ce lien sous la main pour le support.'),
        ],
        '404' => [
            __('Vérifiez l’adresse ou le lien utilisé.'),
            __('Retournez à l’accueil pour reprendre votre navigation.'),
            __('Si le lien vient d’un message, il a peut-être expiré.'),
        ],
        '419' => [
            __('Actualisez la page pour obtenir une nouvelle session.'),
            __('Renvoyez le formulaire si votre action n’a pas été enregistrée.'),
            __('Reconnectez-vous si l’erreur revient.'),
        ],
        '429' => [
            __('Patientez un court instant avant de réessayer.'),
            __('Évitez de relancer plusieurs actions en même temps.'),
            __('Le support peut vérifier un blocage inhabituel.'),
        ],
        '500' => [
            __('Réessayez dans quelques instants.'),
            __('Votre demande n’a pas besoin d’être répétée plusieurs fois.'),
            __('Contactez le support si l’erreur persiste.'),
        ],
        '503' => [
            __('Le service revient dès la fin de l’intervention.'),
            __('Actualisez la page dans quelques minutes.'),
            __('Le support peut confirmer l’état de la plateforme.'),
        ],
        default => [
            __('Retournez à l’accueil et réessayez.'),
            __('Actualisez la page si le problème est temporaire.'),
            __('Contactez le support si le blocage persiste.'),
        ],
    };

    $primaryLabel = $statusCode === '419' ? __('Actualiser') : __('Accueil');
    $primaryUrl = $statusCode === '419' ? $refreshUrl : $homeUrl;
    $primaryIcon = $statusCode === '419' ? 'refresh' : 'home';
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">

        <title>{{ $statusTitle }} | {{ $appName }}</title>

        <style>
            :root {
                --page-bg: #f8fafc;
                --text: #0f172a;
                --muted: #475569;
                --soft: #f1f5f9;
                --surface: rgba(255, 255, 255, 0.86);
                --surface-solid: #ffffff;
                --line: rgba(15, 23, 42, 0.12);
                --line-strong: rgba(15, 23, 42, 0.2);
                --shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
                --accent: #059669;
                --accent-dark: #047857;
                --accent-soft: #d1fae5;
                --accent-text: #064e3b;
                --accent-rgb: 5, 150, 105;
                color-scheme: light;
            }

            body.tone-emerald {
                --accent: #059669;
                --accent-dark: #047857;
                --accent-soft: #d1fae5;
                --accent-text: #064e3b;
                --accent-rgb: 5, 150, 105;
            }

            body.tone-amber {
                --accent: #d97706;
                --accent-dark: #b45309;
                --accent-soft: #fef3c7;
                --accent-text: #78350f;
                --accent-rgb: 217, 119, 6;
            }

            body.tone-sky {
                --accent: #0284c7;
                --accent-dark: #0369a1;
                --accent-soft: #e0f2fe;
                --accent-text: #075985;
                --accent-rgb: 2, 132, 199;
            }

            body.tone-rose {
                --accent: #e11d48;
                --accent-dark: #be123c;
                --accent-soft: #ffe4e6;
                --accent-text: #881337;
                --accent-rgb: 225, 29, 72;
            }

            * {
                box-sizing: border-box;
            }

            html,
            body {
                min-height: 100%;
            }

            body {
                margin: 0;
                min-height: 100vh;
                overflow-x: hidden;
                color: var(--text);
                background:
                    linear-gradient(135deg, rgba(var(--accent-rgb), 0.12) 0%, rgba(var(--accent-rgb), 0) 34%),
                    linear-gradient(45deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0) 30%),
                    repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.045) 0 1px, transparent 1px 72px),
                    repeating-linear-gradient(0deg, rgba(15, 23, 42, 0.04) 0 1px, transparent 1px 72px),
                    var(--page-bg);
                font-family:
                    "Instrument Sans", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                    sans-serif;
                letter-spacing: 0;
            }

            body::before {
                position: fixed;
                inset: 0;
                pointer-events: none;
                content: "";
                background:
                    linear-gradient(120deg, transparent 0 24%, rgba(255, 255, 255, 0.66) 24% 25%, transparent 25% 100%),
                    linear-gradient(300deg, transparent 0 66%, rgba(var(--accent-rgb), 0.11) 66% 67%, transparent 67% 100%);
                opacity: 0.8;
            }

            a {
                color: inherit;
                text-decoration: none;
            }

            .error-shell {
                position: relative;
                z-index: 1;
                display: grid;
                grid-template-columns: minmax(0, 1fr) 392px;
                align-items: center;
                width: min(1120px, calc(100% - 48px));
                min-height: 100vh;
                margin: 0 auto;
                padding: 48px 0;
                gap: 40px;
            }

            .brand {
                display: inline-flex;
                align-items: center;
                min-width: 0;
                margin-bottom: 52px;
                gap: 12px;
                color: var(--text);
                font-size: 15px;
                font-weight: 700;
            }

            .brand-mark {
                display: grid;
                width: 42px;
                height: 42px;
                place-items: center;
                flex: 0 0 auto;
                border-radius: 8px;
                background: var(--accent);
                color: #ffffff;
                box-shadow: 0 12px 28px rgba(var(--accent-rgb), 0.28);
                font-size: 19px;
                font-weight: 800;
            }

            .brand-name {
                overflow-wrap: anywhere;
            }

            .status-kicker {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                margin: 0 0 18px;
                padding: 8px 11px;
                gap: 8px;
                border: 1px solid rgba(var(--accent-rgb), 0.28);
                border-radius: 8px;
                background: rgba(var(--accent-rgb), 0.1);
                color: var(--accent-text);
                font-size: 13px;
                font-weight: 700;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 999px;
                background: var(--accent);
                box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.16);
            }

            .error-title {
                max-width: 720px;
                margin: 0;
                color: var(--text);
                font-size: 56px;
                font-weight: 800;
                line-height: 1.04;
                text-wrap: balance;
            }

            .error-lead {
                max-width: 620px;
                margin: 22px 0 0;
                color: var(--muted);
                font-size: 18px;
                line-height: 1.75;
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
                margin-top: 34px;
                gap: 12px;
            }

            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 46px;
                max-width: 100%;
                padding: 0 16px;
                gap: 10px;
                border: 1px solid transparent;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 750;
                line-height: 1;
                transition:
                    transform 180ms ease,
                    border-color 180ms ease,
                    background 180ms ease,
                    color 180ms ease,
                    box-shadow 180ms ease;
                white-space: nowrap;
            }

            .button:focus-visible {
                outline: 3px solid rgba(var(--accent-rgb), 0.28);
                outline-offset: 3px;
            }

            .button:hover {
                transform: translateY(-1px);
            }

            .button-primary {
                background: var(--accent);
                color: #ffffff;
                box-shadow: 0 14px 32px rgba(var(--accent-rgb), 0.26);
            }

            .button-primary:hover {
                background: var(--accent-dark);
            }

            .button-secondary {
                border-color: var(--line);
                background: var(--surface-solid);
                color: var(--text);
            }

            .button-secondary:hover {
                border-color: rgba(var(--accent-rgb), 0.3);
                color: var(--accent-text);
            }

            .button-quiet {
                border-color: transparent;
                background: transparent;
                color: var(--muted);
            }

            .button-quiet:hover {
                background: rgba(var(--accent-rgb), 0.08);
                color: var(--accent-text);
            }

            .button-icon {
                width: 18px;
                height: 18px;
                flex: 0 0 auto;
            }

            .status-panel {
                overflow: hidden;
                border: 1px solid var(--line);
                border-radius: 8px;
                background: var(--surface);
                box-shadow: var(--shadow);
                backdrop-filter: blur(18px);
            }

            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 18px 0;
                gap: 16px;
                color: var(--muted);
                font-size: 13px;
                font-weight: 700;
            }

            .panel-status {
                display: inline-flex;
                align-items: center;
                min-width: 0;
                gap: 8px;
            }

            .panel-code {
                flex: 0 0 auto;
                color: var(--accent-text);
                font-weight: 800;
            }

            .code-plate {
                position: relative;
                margin: 18px;
                min-height: 236px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                background:
                    linear-gradient(135deg, rgba(var(--accent-rgb), 0.38), rgba(15, 23, 42, 0.12)),
                    #0f172a;
                color: #ffffff;
            }

            .code-plate::before {
                position: absolute;
                inset: 0;
                content: "";
                background:
                    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 42px),
                    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 42px);
                mask-image: linear-gradient(to bottom, #000000, transparent 78%);
            }

            .code-plate::after {
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 3px;
                content: "";
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.82), transparent);
                animation: scan 3.8s ease-in-out infinite;
            }

            .code-number {
                position: absolute;
                top: 26px;
                left: 24px;
                z-index: 1;
                font-size: 104px;
                font-weight: 900;
                line-height: 0.9;
            }

            .code-label {
                position: absolute;
                right: 22px;
                bottom: 20px;
                left: 24px;
                z-index: 1;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 18px;
            }

            .code-label strong {
                display: block;
                max-width: 210px;
                font-size: 18px;
                line-height: 1.35;
            }

            .code-label span {
                color: rgba(255, 255, 255, 0.68);
                font-size: 12px;
                font-weight: 700;
            }

            .signal {
                width: 62px;
                height: 62px;
                flex: 0 0 auto;
                color: rgba(255, 255, 255, 0.9);
            }

            .next-steps {
                padding: 0 20px 20px;
            }

            .next-steps-title {
                margin: 0 0 12px;
                color: var(--text);
                font-size: 14px;
                font-weight: 800;
            }

            .next-steps ul {
                display: grid;
                margin: 0;
                padding: 0;
                gap: 10px;
                list-style: none;
            }

            .next-steps li {
                display: grid;
                grid-template-columns: 22px minmax(0, 1fr);
                align-items: start;
                gap: 10px;
                color: var(--muted);
                font-size: 14px;
                line-height: 1.55;
            }

            .step-mark {
                display: grid;
                width: 22px;
                height: 22px;
                place-items: center;
                border-radius: 999px;
                background: var(--accent-soft);
                color: var(--accent-text);
            }

            .step-mark svg {
                width: 14px;
                height: 14px;
            }

            .panel-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                gap: 12px;
                border-top: 1px solid var(--line);
                color: var(--muted);
                font-size: 12px;
                line-height: 1.4;
            }

            .panel-footer span {
                min-width: 0;
                overflow-wrap: anywhere;
            }

            @keyframes scan {
                0%,
                100% {
                    transform: translateX(-65%);
                    opacity: 0.24;
                }

                50% {
                    transform: translateX(65%);
                    opacity: 0.88;
                }
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    --page-bg: #060914;
                    --text: #f8fafc;
                    --muted: #cbd5e1;
                    --soft: #101827;
                    --surface: rgba(15, 23, 42, 0.78);
                    --surface-solid: rgba(15, 23, 42, 0.92);
                    --line: rgba(226, 232, 240, 0.16);
                    --line-strong: rgba(226, 232, 240, 0.24);
                    --shadow: 0 30px 80px rgba(0, 0, 0, 0.36);
                    color-scheme: dark;
                }

                body {
                    background:
                        linear-gradient(135deg, rgba(var(--accent-rgb), 0.18) 0%, rgba(var(--accent-rgb), 0) 34%),
                        linear-gradient(45deg, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0) 30%),
                        repeating-linear-gradient(90deg, rgba(226, 232, 240, 0.06) 0 1px, transparent 1px 72px),
                        repeating-linear-gradient(0deg, rgba(226, 232, 240, 0.05) 0 1px, transparent 1px 72px),
                        var(--page-bg);
                }

                body::before {
                    background:
                        linear-gradient(120deg, transparent 0 24%, rgba(255, 255, 255, 0.06) 24% 25%, transparent 25% 100%),
                        linear-gradient(300deg, transparent 0 66%, rgba(var(--accent-rgb), 0.12) 66% 67%, transparent 67% 100%);
                }

                .brand,
                .button-secondary {
                    color: var(--text);
                }

                .status-kicker,
                .panel-code,
                .button-secondary:hover,
                .button-quiet:hover {
                    color: #ffffff;
                }

                .button-secondary {
                    background: rgba(15, 23, 42, 0.86);
                }

                .code-plate {
                    background:
                        linear-gradient(135deg, rgba(var(--accent-rgb), 0.42), rgba(2, 6, 23, 0.16)),
                        #020617;
                }
            }

            @media (max-width: 900px) {
                .error-shell {
                    grid-template-columns: 1fr;
                    width: min(720px, calc(100% - 32px));
                    padding: 28px 0 34px;
                    gap: 30px;
                }

                .brand {
                    margin-bottom: 38px;
                }

                .error-title {
                    font-size: 42px;
                    line-height: 1.1;
                }

                .error-lead {
                    font-size: 16px;
                }

                .status-panel {
                    width: 100%;
                }
            }

            @media (max-width: 560px) {
                .error-shell {
                    width: min(100% - 24px, 720px);
                    padding-top: 20px;
                }

                .brand {
                    margin-bottom: 30px;
                }

                .brand-mark {
                    width: 38px;
                    height: 38px;
                }

                .error-title {
                    font-size: 34px;
                }

                .actions {
                    display: grid;
                    grid-template-columns: 1fr;
                }

                .button {
                    width: 100%;
                    white-space: normal;
                }

                .code-plate {
                    min-height: 210px;
                    margin: 14px;
                }

                .code-number {
                    top: 24px;
                    left: 18px;
                    font-size: 78px;
                }

                .code-label {
                    right: 18px;
                    left: 18px;
                }

                .signal {
                    width: 48px;
                    height: 48px;
                }

                .panel-footer {
                    align-items: flex-start;
                    flex-direction: column;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 1ms !important;
                    animation-iteration-count: 1 !important;
                    scroll-behavior: auto !important;
                    transition-duration: 1ms !important;
                }
            }
        </style>
    </head>
    <body class="tone-{{ $tone }}">
        <main class="error-shell" role="main">
            <section class="error-copy" aria-labelledby="error-title">
                <a class="brand" href="{{ $homeUrl }}" aria-label="{{ __('Retour à :app', ['app' => $appName]) }}">
                    <span class="brand-mark" aria-hidden="true">{{ mb_substr($appName, 0, 1) }}</span>
                    <span class="brand-name">{{ $appName }}</span>
                </a>

                <p class="status-kicker">
                    <span class="status-dot" aria-hidden="true"></span>
                    <span>{{ __('Erreur :code', ['code' => $statusCode]) }} · {{ $statusLabel }}</span>
                </p>

                <h1 class="error-title" id="error-title">{{ $statusMessage }}</h1>
                <p class="error-lead">{{ $statusDescription }}</p>

                <nav class="actions" aria-label="{{ __('Actions de récupération') }}">
                    <a class="button button-primary" href="{{ $primaryUrl }}">
                        @if ($primaryIcon === 'refresh')
                            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M21 12a9 9 0 0 1-15.3 6.4" />
                                <path d="M3 12A9 9 0 0 1 18.3 5.6" />
                                <path d="M18 2v4h-4" />
                                <path d="M6 22v-4h4" />
                            </svg>
                        @else
                            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="m3 10.5 9-7 9 7" />
                                <path d="M5 9.5V21h14V9.5" />
                                <path d="M9 21v-6h6v6" />
                            </svg>
                        @endif
                        <span>{{ $primaryLabel }}</span>
                    </a>

                    <a class="button button-secondary" href="{{ $canGoBack ? $previousUrl : $homeUrl }}">
                        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        <span>{{ __('Retour') }}</span>
                    </a>

                    <a class="button button-quiet" href="mailto:{{ $supportEmail }}">
                        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M4 4h16v16H4z" />
                            <path d="m22 6-10 7L2 6" />
                        </svg>
                        <span>{{ __('Support') }}</span>
                    </a>
                </nav>
            </section>

            <aside class="status-panel" aria-label="{{ __('Détails de l’erreur') }}">
                <div class="panel-header">
                    <span class="panel-status">
                        <span class="status-dot" aria-hidden="true"></span>
                        <span>{{ __('Statut HTTP') }}</span>
                    </span>
                    <span class="panel-code">{{ $statusCode }}</span>
                </div>

                <div class="code-plate" aria-hidden="true">
                    <div class="code-number">{{ $statusCode }}</div>
                    <div class="code-label">
                        <div>
                            <span>{{ __('Diagnostic') }}</span>
                            <strong>{{ $statusLabel }}</strong>
                        </div>
                        <svg class="signal" viewBox="0 0 64 64" fill="none">
                            <path d="M10 48h12l8-32 8 40 8-22h8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 16h10M44 16h10M10 32h6M48 32h6" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".42" />
                        </svg>
                    </div>
                </div>

                <div class="next-steps">
                    <p class="next-steps-title">{{ __('Prochaines actions') }}</p>
                    <ul>
                        @foreach ($nextSteps as $step)
                            <li>
                                <span class="step-mark" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                        <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span>{{ $step }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="panel-footer">
                    <span>{{ request()->getHost() }}</span>
                    <span>{{ __('Aide disponible') }}</span>
                </div>
            </aside>
        </main>
    </body>
</html>
