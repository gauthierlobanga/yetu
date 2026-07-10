<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Votre panier vous attend</title>
    <!-- Tailwind CSS via CDN (pour le design rapide) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Styles de base compatibles emails */
        body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #0f172a;
            /* slate-900 */
        }

        img {
            border: none;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        .hover-glow:hover {
            box-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            .product-img {
                width: 80px !important;
                height: 80px !important;
            }

            .cta-button {
                font-size: 16px !important;
                padding: 14px 24px !important;
            }
        }
    </style>
</head>

<body class="antialiased" style="background-color:#0f172a;">
    <div class="max-w-xl mx-auto px-4 py-10">
        <!-- Logo -->
        <div class="text-center mb-8">
            <img src="{{ config('app.logo_url') ?? 'https://via.placeholder.com/140x32/FFFFFF/000000?text=YETU' }}"
                alt="{{ config('app.name') }}" class="h-8 inline-block"
                style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.15));">
        </div>

        <!-- Hero -->
        <div class="rounded-3xl p-8 mb-6 text-center"
            style="background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.05));">
            <h1 class="text-3xl font-bold text-white leading-tight tracking-tight mb-3">
                <span class="bg-clip-text text-transparent bg-linear-to-r from-yellow-400 to-orange-500">
                    {{ $panier->client->prenom ?? 'Bonjour' }}
                </span>,<br>votre panier vous attend
            </h1>
            <p class="text-gray-400 text-sm leading-relaxed">
                Les articles ci‑dessous sont toujours disponibles. Finalisez votre commande avant qu'ils ne
                disparaissent.
            </p>
        </div>

        <!-- Liste des produits -->
        <div class="rounded-3xl p-6 mb-6 border border-white/10"
            style="background: rgba(255,255,255,0.04); backdrop-filter: blur(12px);">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
                <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 mr-3">🛒</span>
                Votre sélection ({{ $panier->nb_articles }} articles)
            </h2>

            @foreach ($panier->items as $item)
                @php
                    $produit = $item->produit;
                    // Récupération de l'image optimisée (card = 400x300)
$image =
    $produit?->getFirstMediaUrl('images', 'card') ?:
    $produit?->getFirstMediaUrl('image_principale', 'card') ?:
    'https://via.placeholder.com/100x100/1e293b/ffffff?text=📦';
                @endphp
                <div class="flex items-start p-3 rounded-2xl mb-3" style="background: rgba(255,255,255,0.03);">
                    <img src="{{ $image }}" width="100" height="100"
                        class="rounded-xl object-cover shadow-lg shrink-0 product-img"
                        alt="{{ $item->nom_produit }}">
                    <div class="ml-4 flex-1 min-w-0">
                        <p class="text-white font-semibold text-base leading-tight mb-1">{{ $item->nom_produit }}</p>
                        @if ($item->variante && !empty($item->variante->attributs))
                            <div class="flex flex-wrap gap-1 mb-2">
                                @foreach ($item->variante->attributs as $k => $v)
                                    <span
                                        class="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{{ $k }}:
                                        {{ $v }}</span>
                                @endforeach
                            </div>
                        @endif
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Qté : {{ $item->quantite }}</span>
                            <span class="font-bold text-yellow-400">{{ number_format($item->prix_total, 2, ',', ' ') }}
                                €</span>
                        </div>
                    </div>
                </div>
            @endforeach

            <!-- Total + CTA -->
            <div class="border-t border-white/10 pt-5 mt-4">
                <div class="flex justify-between items-center mb-5">
                    <span class="text-xl font-bold text-white">Total</span>
                    <span
                        class="text-xl font-bold text-yellow-400">{{ number_format($panier->total_general, 2, ',', ' ') }}
                        €</span>
                </div>
                <a href="{{ $recoverUrl }}" target="_blank"
                    class="block text-center bg-linear-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-orange-500/40 transition-all duration-200 uppercase tracking-wide cta-button hover-glow">
                    Reprendre ma commande
                </a>
                <p class="text-center text-gray-500 text-xs mt-3">
                    Lien valable 24h • Votre panier expire bientôt
                </p>
            </div>
        </div>

        <!-- Cross‑sell (produit phare) -->
        @if ($produitPhare)
            <div class="rounded-3xl p-5 border border-yellow-500/20"
                style="background: linear-gradient(145deg, rgba(255,215,0,0.08), rgba(255,215,0,0.01));">
                <p class="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-3">✨ Vous aimerez aussi</p>
                <div class="flex items-center">
                    @php
                        $phareImg =
                            $produitPhare->getFirstMediaUrl('images', 'card') ?:
                            $produitPhare->getFirstMediaUrl('image_principale', 'card') ?:
                            'https://via.placeholder.com/80x80/1e293b/ffffff?text=✨';
                    @endphp
                    <img src="{{ $phareImg }}" width="80" height="80"
                        class="rounded-2xl object-cover shadow-lg shrink-0">
                    <div class="ml-4 flex-1">
                        <p class="text-white font-semibold mb-1">{{ $produitPhare->nom }}</p>
                        <p class="text-gray-400 text-xs mb-2">{{ Str::limit($produitPhare->short_description, 60) }}
                        </p>
                        <a href="{{ $produitPhare->url }}" target="_blank"
                            class="text-yellow-400 font-semibold text-sm underline">
                            Découvrir →
                        </a>
                    </div>
                </div>
            </div>
        @endif

        <!-- Footer -->
        <div class="text-center mt-10 pt-6 border-t border-white/10">
            <p class="text-gray-500 text-xs mb-2">© {{ date('Y') }} {{ config('app.name') }} — Expérience
                réinventée</p>
            <p class="text-gray-600 text-xs">
                Si vous ne souhaitez plus recevoir ces rappels,
                <a href="#" class="text-yellow-400 underline">désabonnez‑vous</a>
            </p>
            <div class="flex justify-center mt-4 space-x-3">
                <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-gray-400 text-xs">f</span>
                <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-gray-400 text-xs">t</span>
                <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-gray-400 text-xs">i</span>
            </div>
        </div>
    </div>
</body>

</html>
