<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Votre boutique est prête</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f8fafc;
        }

        img {
            border: none;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        @media screen and (max-width: 600px) {
            .qr-code {
                width: 160px !important;
                height: auto !important;
            }

            .hero-title {
                font-size: 24px !important;
            }
        }
    </style>
</head>

<body class="antialiased" style="background-color:#f8fafc;">
    <div class="max-w-xl mx-auto px-4 py-10">
        <!-- En-tête -->
        <div class="text-center mb-8">
            <img src="{{ config('app.logo_url') ?? 'https://via.placeholder.com/140x32/059669/ffffff?text=YETU' }}"
                alt="{{ config('app.name') }}" class="h-8 inline-block">
        </div>

        <!-- Hero -->
        <div
            class="rounded-3xl p-8 mb-6 text-center bg-linear-to-br from-emerald-600 to-emerald-700 text-white shadow-xl">
            <h1 class="text-3xl font-bold leading-tight mb-2 hero-title">
                🎉 Félicitations {{ $user->name }} !
            </h1>
            <p class="text-emerald-100 text-base">
                Votre boutique est officiellement en ligne
            </p>
        </div>

        <!-- Carte boutique -->
        <div class="rounded-3xl p-5 mb-6 bg-white border border-gray-100 shadow-sm">
            <div class="flex items-center">
                @if ($logoUrl)
                    <img src="{{ $logoUrl }}" alt="{{ $shopName }}" width="56" height="56"
                        class="rounded-xl object-cover shrink-0 mr-4 shadow-sm">
                @endif
                <div>
                    <p class="text-sm text-emerald-700 font-medium mb-0.5">Votre boutique</p>
                    <p class="text-xl font-bold text-gray-800">{{ $shopName }}</p>
                    <p class="text-sm text-gray-500 mt-1">
                        Plan <strong>{{ $planName }}</strong>
                        @if ($expiration)
                            · Expire le {{ $expiration }}
                        @endif
                    </p>
                </div>
            </div>
        </div>

        <!-- QR Code + Accès -->
        <div class="rounded-3xl p-6 mb-6 bg-white border border-gray-100 shadow-sm text-center">
            <p class="text-base font-semibold text-gray-700 mb-4">
                Accédez à votre tableau de bord
            </p>
            <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code"
                class="mx-auto rounded-2xl border border-gray-200 shadow-sm qr-code" width="200" height="200">
            <a href="{{ $shopUrl }}" target="_blank"
                class="inline-block mt-5 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-base px-8 py-3.5 rounded-full uppercase tracking-wide shadow-lg hover:shadow-emerald-500/30 transition-all duration-200">
                Accéder à ma boutique
            </a>
            <p class="text-xs text-gray-400 mt-3">
                Ou copiez ce lien :<br>
                <a href="{{ $shopUrl }}" class="text-emerald-600 underline break-all">{{ $shopUrl }}</a>
            </p>
        </div>

        <!-- Prochaines étapes -->
        <div class="rounded-3xl p-6 mb-6 bg-white border border-gray-100 shadow-sm">
            <h2 class="text-lg font-bold text-gray-800 mb-4">🚀 Prochaines étapes</h2>
            <div class="space-y-3">
                @foreach (['Personnalisez votre boutique (logo, couleurs, domaine)', 'Ajoutez vos premiers produits', 'Configurez vos moyens de paiement et de livraison', 'Partagez votre lien et commencez à vendre !'] as $index => $step)
                    <div class="flex items-start">
                        <span
                            class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm mr-3 shrink-0">
                            {{ $index + 1 }}
                        </span>
                        <span class="text-gray-700 text-sm">{{ $step }}</span>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Support -->
        <div class="rounded-3xl p-5 mb-6 bg-gray-50 border border-gray-200">
            <p class="text-sm text-gray-600">
                Besoin d'aide ? Consultez notre
                <a href="{{ $helpUrl }}" class="text-emerald-600 font-semibold underline">centre d'aide</a>
                ou contactez-nous à
                <a href="mailto:{{ $supportEmail }}"
                    class="text-emerald-600 font-semibold underline">{{ $supportEmail }}</a>
            </p>
        </div>

        <!-- Pied de page -->
        <div class="text-center mt-8 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-400 mb-1">© {{ date('Y') }} {{ config('app.name') }}. Tous droits
                réservés.</p>
            <p class="text-xs text-gray-400">Cet e-mail a été envoyé à {{ $user->email }} suite à la création de votre
                boutique.</p>
        </div>
    </div>
</body>

</html>
