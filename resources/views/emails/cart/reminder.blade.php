<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Votre panier vous attend</title>
    <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
    <style>
        /* Reset + styles inline de secours */
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img {
            border: 0;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: #0A0A0A;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        @media screen and (max-width: 599px) {
            .responsive-table {
                width: 100% !important;
            }

            .product-img {
                width: 80px !important;
                height: 80px !important;
            }

            .full-width-mobile {
                width: 100% !important;
            }
        }
    </style>
</head>

<body
    style="margin:0; padding:0; background-color:#0A0A0A; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <center style="width:100%; table-layout:fixed; background-color:#0A0A0A;">
        <!--[if mso]><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td><![endif]-->
        <div style="max-width:600px; margin:0 auto; background-color:#0A0A0A; padding:20px 0;">

            <!-- En-tête avec logo et effet néon -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="max-width:600px;">
                <tr>
                    <td style="padding:30px 20px 10px; text-align:center;">
                        <img src="https://via.placeholder.com/120x30/FFFFFF/000000?text=LOGO"
                            alt="{{ config('app.name') }}"
                            style="width:120px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));">
                    </td>
                </tr>
            </table>

            <!-- Bannière héroïque avec verre dépoli -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="max-width:600px;">
                <tr>
                    <td
                        style="padding:20px 20px 0; background: radial-gradient(circle at 20% 30%, rgba(66,153,225,0.25), transparent 70%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.2), transparent 70%); border-radius:24px 24px 0 0; backdrop-filter: blur(15px);">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td style="padding:40px 20px 30px; text-align:center;">
                                    <h1
                                        style="margin:0; font-size:32px; color:#FFFFFF; font-weight:700; letter-spacing:-0.5px; line-height:1.2;">
                                        <span
                                            style="background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                            {{ $panier->client->prenom ?? 'Bonjour' }}
                                        </span>,<br>votre panier respire encore
                                    </h1>
                                    <p style="margin:15px 0 0; color:#B0B7C3; font-size:16px; line-height:1.5;">
                                        On a mis de côté vos trésors. Ils sont toujours disponibles,<br>mais certains
                                        pourraient disparaître vite…
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Section produits (cartes glass) -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="max-width:600px; background-color:#0A0A0A;">
                <tr>
                    <td style="padding:10px 20px 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                            style="background: rgba(255,255,255,0.05); backdrop-filter: blur(25px); border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
                            <tr>
                                <td style="padding:20px;">
                                    <h2
                                        style="margin:0 0 20px; color:#FFFFFF; font-size:20px; font-weight:600; display:flex; align-items:center;">
                                        <span
                                            style="display:inline-block; width:24px; height:24px; background: rgba(255,215,0,0.15); border-radius:6px; text-align:center; line-height:24px; margin-right:10px;">🛒</span>
                                        Votre sélection ({{ $panier->nb_articles }} articles)
                                    </h2>

                                    @foreach ($panier->items as $item)
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%"
                                            style="margin-bottom:16px; background: rgba(255,255,255,0.03); border-radius:16px; padding:12px;">
                                            <tr>
                                                <!-- Image produit -->
                                                <td width="90" style="vertical-align:top; padding-right:16px;">
                                                    @php
                                                        $image =
                                                            $item->produit?->getFirstMediaUrl('images', 'card') ?:
                                                            $item->produit?->getFirstMediaUrl(
                                                                'image_principale',
                                                                'card',
                                                            ) ?:
                                                            'https://via.placeholder.com/90x90/2D3748/FFFFFF?text=🖼️';
                                                    @endphp
                                                    <img src="{{ $image }}" width="90" height="90"
                                                        alt="{{ $item->nom_produit }}"
                                                        style="display:block; border-radius:12px; object-fit:cover; box-shadow: 0 8px 20px rgba(0,0,0,0.6);"
                                                        class="product-img">
                                                </td>
                                                <!-- Détails -->
                                                <td style="vertical-align:middle; color:#E2E8F0;">
                                                    <p
                                                        style="margin:0 0 4px; font-weight:600; font-size:16px; color:#FFFFFF;">
                                                        {{ $item->nom_produit }}</p>
                                                    @if ($item->variante)
                                                        @php
                                                            $attrs = $item->variante->attributs ?? [];
                                                        @endphp
                                                        <p style="margin:0 0 6px; font-size:13px; color:#A0AEC0;">
                                                            @foreach ($attrs as $key => $val)
                                                                <span
                                                                    style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:20px; margin-right:5px;">{{ $key }}:
                                                                    {{ $val }}</span>
                                                            @endforeach
                                                        </p>
                                                    @endif
                                                    <p style="margin:0; font-size:14px;">
                                                        Qté : {{ $item->quantite }}
                                                        <span style="float:right; font-weight:700; color:#FFD700;">
                                                            {{ number_format($item->prix_total, 2, ',', ' ') }} €
                                                        </span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    @endforeach

                                    <!-- Total + bouton -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                        width="100%">
                                        <tr>
                                            <td style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px;">
                                                <table role="presentation" cellspacing="0" cellpadding="0"
                                                    border="0" width="100%">
                                                    <tr>
                                                        <td style="font-size:18px; color:#FFFFFF; font-weight:700;">
                                                            Total :
                                                            {{ number_format($panier->total_general, 2, ',', ' ') }} €
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top:18px; text-align:center;">
                                                            <!-- Bouton CTA effet néon -->
                                                            <a href="{{ $recoverUrl }}" target="_blank"
                                                                style="display:inline-block; background: linear-gradient(135deg, #FFD700, #FF8C00); color:#0A0A0A; font-weight:700; font-size:18px; text-decoration:none; padding:16px 40px; border-radius:40px; letter-spacing:0.5px; box-shadow: 0 0 25px rgba(255,140,0,0.5); text-transform:uppercase;">
                                                                Reprendre ma commande
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style="padding-top:12px; text-align:center; font-size:12px; color:#718096;">
                                                            Lien valable 24h • Votre panier expire bientôt
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Nouveauté : cross-sell / produit phare -->
            @if ($produitPhare)
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                    style="max-width:600px; background-color:#0A0A0A;">
                    <tr>
                        <td style="padding:0 20px 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                width="100%"
                                style="background: linear-gradient(145deg, rgba(255,215,0,0.1), rgba(255,215,0,0.02)); border-radius:24px; border:1px solid rgba(255,215,0,0.15); overflow:hidden;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p
                                            style="margin:0 0 12px; font-size:14px; color:#FFD700; font-weight:600; text-transform:uppercase; letter-spacing:2px;">
                                            ✨ Vous aimerez aussi</p>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%">
                                            <tr>
                                                <td width="70" style="padding-right:16px;">
                                                    @php
                                                        $phareImg =
                                                            $produitPhare->getFirstMediaUrl('images', 'card') ?:
                                                            $produitPhare->getFirstMediaUrl(
                                                                'image_principale',
                                                                'card',
                                                            ) ?:
                                                            'https://via.placeholder.com/70x70/2D3748/FFFFFF?text=✨';
                                                    @endphp
                                                    <img src="{{ $phareImg }}" width="70" height="70"
                                                        style="border-radius:16px; object-fit:cover; box-shadow:0 4px 15px rgba(0,0,0,0.5);">
                                                </td>
                                                <td style="vertical-align:middle;">
                                                    <p
                                                        style="margin:0 0 4px; font-weight:600; color:#FFFFFF; font-size:16px;">
                                                        {{ $produitPhare->nom }}</p>
                                                    <p style="margin:0 0 8px; font-size:14px; color:#A0AEC0;">
                                                        {{ Str::limit($produitPhare->short_description, 60) }}</p>
                                                    <a href="{{ $produitPhare->url }}" target="_blank"
                                                        style="color:#FFD700; font-weight:600; font-size:14px; text-decoration:none; border-bottom:1px solid #FFD700;">
                                                        Découvrir →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            @endif

            <!-- Pied de page futuriste -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="max-width:600px;">
                <tr>
                    <td
                        style="padding:30px 20px; text-align:center; background: rgba(255,255,255,0.02); border-radius:0 0 24px 24px;">
                        <p style="margin:0 0 12px; color:#4A5568; font-size:12px; letter-spacing:0.5px;">
                            © {{ date('Y') }} {{ config('app.name') }} — Expérience réinventée
                        </p>
                        <p style="margin:0; color:#718096; font-size:12px;">
                            Si vous ne souhaitez plus recevoir ces rappels,
                            <a href="#" style="color:#FFD700; text-decoration:none;">désabonnez-vous</a>
                        </p>
                        <!-- Social icônes minimalistes -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"
                            style="margin-top:15px;">
                            <tr>
                                <td style="padding:0 8px;"><img
                                        src="https://via.placeholder.com/24x24/2D3748/FFFFFF?text=f" width="24"
                                        height="24" style="display:block;"></td>
                                <td style="padding:0 8px;"><img
                                        src="https://via.placeholder.com/24x24/2D3748/FFFFFF?text=t" width="24"
                                        height="24" style="display:block;"></td>
                                <td style="padding:0 8px;"><img
                                        src="https://via.placeholder.com/24x24/2D3748/FFFFFF?text=i" width="24"
                                        height="24" style="display:block;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

        </div>
        <!--[if mso]></td></tr></table><![endif]-->
    </center>
</body>

</html>
{{-- <x-mail::message>
# Vous avez oublié quelque chose ?

Bonjour {{ $panier->client->prenom ?? $panier->client->nom }},

Nous avons remarqué que vous avez laissé des articles dans votre panier.
Ils vous attendent toujours !

@foreach ($panier->items as $item)
* {{ $item->quantite }}x {{ $item->nom_produit }} ({{ number_format($item->prix_total, 2) }} €)
@endforeach

<x-mail::button :url="$recoverUrl">
Reprendre ma commande
</x-mail::button>

À très bientôt,
L'équipe {{ config('app.name') }}
</x-mail::message> --}}
