<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $commande->numero_commande }}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1f2937;
            background-color: #ffffff;
            font-size: 12px;
            -webkit-font-smoothing: antialiased;
        }

        /* DomPDF fixes */
        table {
            page-break-inside: auto;
            border-collapse: collapse;
            width: 100%;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-footer-group;
        }

        td,
        th {
            vertical-align: top;
        }

        /* Styling personnalisé */
        .border-subtle {
            border-color: #e5e7eb;
        }

        .text-muted {
            color: #6b7280;
        }
    </style>
</head>

<body class="p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header avec logo et nom de l'entreprise -->
        <table class="w-full mb-10">
            <tr>
                <td class="align-middle text-left" style="width: 70%;">
                    <div class="flex items-center">
                        @if (!empty($company['logo_url']))
                            <img src="{{ $company['logo_url'] }}" alt="Logo"
                                class="h-12 w-auto mr-4 rounded-lg shadow-sm" style="max-height: 48px;">
                        @endif
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ $company['name'] }}</h1>
                            @if (!empty($company['siret']))
                                <p class="text-sm text-gray-500">SIRET : {{ $company['siret'] }}</p>
                            @endif
                            @if (!empty($company['tva']))
                                <p class="text-sm text-gray-500">N° TVA : {{ $company['tva'] }}</p>
                            @endif
                        </div>
                    </div>
                    <div class="mt-3 text-gray-500 text-sm leading-snug space-y-1">
                        <p>{{ $company['address'] }}</p>
                        @if (!empty($company['phone']))
                            <p>{{ $company['phone'] }}</p>
                        @endif
                        @if (!empty($company['email']))
                            <p>{{ $company['email'] }}</p>
                        @endif
                    </div>
                </td>
                <td class="align-top text-right" style="width: 30%;">
                    <h2 class="text-3xl font-light text-gray-300 uppercase tracking-widest mb-4">Facture</h2>
                    <table class="w-full text-right text-sm ml-auto" style="max-width: 220px;">
                        <tr>
                            <td class="py-1 text-gray-400 font-medium text-left">Numéro</td>
                            <td class="py-1 pl-2 text-gray-900 font-semibold text-right">
                                {{ $commande->numero_commande }}</td>
                        </tr>
                        <tr>
                            <td class="py-1 text-gray-400 font-medium text-left">Date d'émission</td>
                            <td class="py-1 pl-2 text-gray-900 text-right">
                                {{ optional($commande->date_commande)->format('d M Y') ?? '—' }}</td>
                        </tr>
                        @if ($commande->date_paiement)
                            <tr>
                                <td class="py-1 text-gray-400 font-medium text-left">Date de paiement</td>
                                <td class="py-1 pl-2 text-gray-900 text-right">
                                    {{ $commande->date_paiement->format('d M Y') }}</td>
                            </tr>
                        @endif
                        <tr>
                            <td class="py-1 text-gray-400 font-medium text-left">Montant dû</td>
                            <td class="py-1 pl-2 text-gray-900 font-bold text-right">
                                {{ number_format($commande->total, 2, ',', ' ') }} €</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Client : facturé à / livré à -->
        <table class="w-full mb-12 mt-8">
            <tr>
                <td class="w-1/2 align-top pr-8 text-left">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Facturé à</h3>
                    <p class="font-semibold text-gray-900 mb-1">
                        {{ $commande->client->full_name ?? ($commande->client->nom ?? 'Client') }}</p>
                    <div class="text-gray-500 text-sm leading-snug space-y-1">
                        @if ($commande->adresseFacturation)
                            <p>{{ $commande->adresseFacturation->rue }}</p>
                            @if ($commande->adresseFacturation->complement)
                                <p>{{ $commande->adresseFacturation->complement }}</p>
                            @endif
                            <p>{{ $commande->adresseFacturation->code_postal }}
                                {{ $commande->adresseFacturation->ville }}</p>
                            <p>{{ $commande->adresseFacturation->pays }}</p>
                        @else
                            <p class="italic text-gray-400">Adresse non renseignée</p>
                        @endif
                    </div>
                </td>
                <td class="w-1/2 align-top pl-8 border-l border-gray-200 text-left">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Livré à</h3>
                    <p class="font-semibold text-gray-900 mb-1">
                        {{ $commande->client->full_name ?? ($commande->client->nom ?? 'Client') }}</p>
                    <div class="text-gray-500 text-sm leading-snug space-y-1">
                        @if ($commande->adresseLivraison)
                            <p>{{ $commande->adresseLivraison->rue }}</p>
                            @if ($commande->adresseLivraison->complement)
                                <p>{{ $commande->adresseLivraison->complement }}</p>
                            @endif
                            <p>{{ $commande->adresseLivraison->code_postal }} {{ $commande->adresseLivraison->ville }}
                            </p>
                            <p>{{ $commande->adresseLivraison->pays }}</p>
                        @else
                            <p class="italic text-gray-400">Identique à la facturation</p>
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        <!-- Tableau des articles -->
        <table class="w-full text-left mb-12 mt-8">
            <thead>
                <tr>
                    <th style="width: 45%;"
                        class="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 text-left">
                        Description</th>
                    <th style="width: 10%;"
                        class="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 text-center">
                        Qté</th>
                    <th style="width: 15%;"
                        class="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 text-right">
                        PU HT</th>
                    <th style="width: 15%;"
                        class="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 text-right">
                        TVA</th>
                    <th style="width: 15%;"
                        class="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 text-right">
                        Total TTC</th>
                </tr>
            </thead>
            <tbody class="text-gray-700">
                @foreach ($commande->lignes as $ligne)
                    <tr>
                        <td class="py-4 border-b border-gray-100 text-left">
                            <span
                                class="font-medium text-gray-900 block">{{ $ligne->produit->nom ?? 'Produit' }}</span>
                            @if ($ligne->variante)
                                @php
                                    $attrs = $ligne->variante->attributs ?? [];
                                @endphp
                                @if (!empty($attrs))
                                    <div class="flex flex-wrap gap-1 mt-1">
                                        @foreach ($attrs as $k => $v)
                                            <span
                                                class="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{{ $k }}:
                                                {{ $v }}</span>
                                        @endforeach
                                    </div>
                                @endif
                            @endif
                        </td>
                        <td class="py-4 border-b border-gray-100 text-center text-gray-600">{{ $ligne->quantite }}</td>
                        <td class="py-4 border-b border-gray-100 text-right text-gray-600">
                            {{ number_format($ligne->prix_unitaire, 2, ',', ' ') }} €</td>
                        <td class="py-4 border-b border-gray-100 text-right text-gray-500 text-xs">
                            {{ number_format($ligne->taxe ?? 0, 2, ',', ' ') }} €</td>
                        <td class="py-4 border-b border-gray-100 text-right text-gray-900 font-medium">
                            {{ number_format($ligne->prix_total, 2, ',', ' ') }} €</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totaux -->
        <table class="w-full mb-16">
            <tr>
                <td class="w-1/2 align-bottom pr-8 text-left">
                    @if ($commande->notes)
                        <div class="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <strong class="block text-gray-700 mb-1">Note :</strong>
                            {{ $commande->notes }}
                        </div>
                    @endif
                </td>
                <td class="w-1/2 align-top text-right">
                    <table class="w-full text-sm ml-auto" style="max-width: 280px;">
                        <tr>
                            <td class="py-2 text-gray-500 text-left">Sous-total HT</td>
                            <td class="py-2 text-right text-gray-900">
                                {{ number_format($commande->sous_total, 2, ',', ' ') }} €</td>
                        </tr>
                        <tr>
                            <td class="py-2 text-gray-500 text-left">TVA</td>
                            <td class="py-2 text-right text-gray-900">{{ number_format($commande->taxe, 2, ',', ' ') }}
                                €</td>
                        </tr>
                        @if ($commande->frais_livraison > 0)
                            <tr>
                                <td class="py-2 text-gray-500 text-left">Frais de livraison</td>
                                <td class="py-2 text-right text-gray-900">
                                    {{ number_format($commande->frais_livraison, 2, ',', ' ') }} €</td>
                            </tr>
                        @endif
                        {{-- Remises non disponibles dans Commande, laissé conditionnel --}}
                        @if (isset($commande->total_remises) && $commande->total_remises > 0)
                            <tr>
                                <td class="py-2 text-emerald-600 text-left">Remises</td>
                                <td class="py-2 text-right text-emerald-600">
                                    -{{ number_format($commande->total_remises, 2, ',', ' ') }} €</td>
                            </tr>
                        @endif
                        <tr>
                            <td colspan="2" class="border-b-2 border-gray-900 my-2"></td>
                        </tr>
                        <tr>
                            <td class="py-3 text-base font-semibold text-gray-900 text-left">Total TTC</td>
                            <td class="py-3 text-right text-xl font-bold text-gray-900">
                                {{ number_format($commande->total, 2, ',', ' ') }} €</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Signature & Informations légales -->
        <div class="mt-12 pt-8 border-t border-gray-200">
            <table class="w-full mb-8">
                <tr>
                    <td class="w-1/2 text-left pr-8">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">Signature de
                            l'Entreprise</p>
                        <div class="border-b border-gray-300 w-48"></div>
                    </td>
                    <td class="w-1/2 text-right pl-8">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">Signature de
                            l'Acheteur</p>
                        <div class="border-b border-gray-300 w-48 ml-auto"></div>
                    </td>
                </tr>
            </table>
            <p class="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Informations légales</p>
            <p class="text-xs text-gray-400 mb-2">{{ $company['name'] }} • SIRET : {{ $company['siret'] ?? 'N/A' }} •
                TVA : {{ $company['tva'] ?? 'N/A' }}</p>
            <p class="text-xs text-gray-400 leading-relaxed text-justify">
                Facture payable à réception. Aucun escompte pour paiement anticipé. En cas de retard de paiement, une
                pénalité égale à 3 fois le taux d'intérêt légal sera appliquée dès le jour suivant la date d'échéance.
                En outre, une indemnité forfaitaire pour frais de recouvrement de 40 € sera due (Art. D441-5 du Code de
                Commerce).
            </p>
        </div>
    </div>
</body>

</html>
