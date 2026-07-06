<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Votre boutique est prête</title>
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
        /* Reset général pour les clients mobiles */
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
            background-color: #F8FAFC;
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

        /* Responsive : réduction du QR code sur petits écrans */
        @media screen and (max-width: 599px) {
            .responsive-table {
                width: 100% !important;
            }

            .qr-code {
                width: 180px !important;
                height: auto !important;
            }
        }
    </style>
</head>

<body
    style="margin:0; padding:0; background-color:#F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <center style="width:100%; table-layout:fixed; background-color:#F8FAFC;">
        <!--[if mso]><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td><![endif]-->
        <div
            style="max-width:600px; margin:0 auto; background-color:#FFFFFF; border-radius:24px; overflow:hidden; border:1px solid #E5E7EB;">

            <!-- ==================== EN-TÊTE ==================== -->
            <!-- Fallback : couleur unie pour Outlook, dégradé pour les autres -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:#059669; background-image: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius:24px 24px 0 0;">
                <tr>
                    <td style="padding:40px 30px; text-align:center;">
                        <h1
                            style="margin:0; font-size:28px; color:#FFFFFF; font-weight:700; letter-spacing:-0.5px; line-height:1.2;">
                            🎉 Félicitations {{ $user->name }} !
                        </h1>
                        <p style="margin:10px 0 0; color:#D1FAE5; font-size:16px;">
                            Votre boutique est officiellement en ligne
                        </p>
                    </td>
                </tr>
            </table>

            <!-- ==================== CORPS DU MESSAGE ==================== -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:#FFFFFF;">
                <tr>
                    <td style="padding:30px 30px 20px;">

                        {{-- Bloc « Votre boutique » avec logo --}}
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                            style="background-color:#F0FDF4; border-radius:16px; border:1px solid #A7F3D0;">
                            <tr>
                                <td style="padding:20px;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                        width="100%">
                                        <tr>
                                            @if ($logoUrl)
                                                <td width="56" style="vertical-align:top; padding-right:16px;">
                                                    <img src="{{ $logoUrl }}" alt="{{ $shopName }}"
                                                        width="56" height="56"
                                                        style="display:block; border-radius:12px; object-fit:cover; background-color:#FFFFFF;">
                                                </td>
                                            @endif
                                            <td style="vertical-align:middle;">
                                                <p
                                                    style="margin:0 0 4px; font-size:14px; color:#047857; font-weight:600;">
                                                    Votre boutique</p>
                                                <p style="margin:0; font-size:20px; color:#1F2937; font-weight:700;">
                                                    {{ $shopName }}</p>
                                                <p style="margin:6px 0 0; font-size:14px; color:#4B5563;">
                                                    Plan <strong>{{ $planName }}</strong>
                                                    @if ($expiration)
                                                        · Expire le {{ $expiration }}
                                                    @endif
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        {{-- QR code + bouton d'accès --}}
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                            style="margin-top:24px;">
                            <tr>
                                <td style="text-align:center;">
                                    <p style="margin:0 0 12px; font-size:16px; color:#374151; font-weight:600;">
                                        Accédez à votre tableau de bord
                                    </p>

                                    <!-- QR code (base64) -->
                                    <img src="data:image/png;base64,{{ $qrCode }}"
                                        alt="QR Code pour accéder à votre boutique" width="200" height="200"
                                        style="display:block; margin:0 auto 20px; border-radius:16px; border:1px solid #E5E7EB;"
                                        class="qr-code">

                                    <!-- Bouton CTA avec fallback de couleur pour Outlook -->
                                    <a href="{{ $shopUrl }}" target="_blank"
                                        style="display:inline-block; background-color:#059669; background-image: linear-gradient(135deg, #059669, #047857); color:#FFFFFF; font-weight:600; font-size:16px; text-decoration:none; padding:14px 36px; border-radius:40px; text-transform:uppercase; letter-spacing:0.5px;">
                                        Accéder à ma boutique
                                    </a>

                                    <p style="margin:12px 0 0; font-size:12px; color:#9CA3AF;">
                                        Ou copiez ce lien :<br>
                                        <a href="{{ $shopUrl }}"
                                            style="color:#059669; word-break:break-all; text-decoration:underline;">{{ $shopUrl }}</a>
                                    </p>
                                </td>
                            </tr>
                        </table>

                        {{-- Prochaines étapes --}}
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                            style="margin-top:30px;">
                            <tr>
                                <td>
                                    <h2 style="margin:0 0 16px; font-size:18px; color:#1F2937; font-weight:600;">
                                        🚀 Prochaines étapes
                                    </h2>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                        width="100%">
                                        <tr>
                                            <td style="padding-bottom:12px;">
                                                <span
                                                    style="display:inline-block; width:24px; height:24px; background:#D1FAE5; border-radius:6px; text-align:center; line-height:24px; margin-right:8px; font-size:14px; font-weight:600; color:#047857;">1</span>
                                                <span style="font-size:15px; color:#374151;">Personnalisez votre
                                                    boutique (logo, couleurs, domaine)</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom:12px;">
                                                <span
                                                    style="display:inline-block; width:24px; height:24px; background:#D1FAE5; border-radius:6px; text-align:center; line-height:24px; margin-right:8px; font-size:14px; font-weight:600; color:#047857;">2</span>
                                                <span style="font-size:15px; color:#374151;">Ajoutez vos premiers
                                                    produits</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom:12px;">
                                                <span
                                                    style="display:inline-block; width:24px; height:24px; background:#D1FAE5; border-radius:6px; text-align:center; line-height:24px; margin-right:8px; font-size:14px; font-weight:600; color:#047857;">3</span>
                                                <span style="font-size:15px; color:#374151;">Configurez vos moyens de
                                                    paiement et de livraison</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style="display:inline-block; width:24px; height:24px; background:#D1FAE5; border-radius:6px; text-align:center; line-height:24px; margin-right:8px; font-size:14px; font-weight:600; color:#047857;">4</span>
                                                <span style="font-size:15px; color:#374151;">Partagez votre lien et
                                                    commencez à vendre !</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        {{-- Aide & support --}}
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                            style="margin-top:24px; background-color:#F9FAFB; border-radius:12px; border:1px solid #E5E7EB;">
                            <tr>
                                <td style="padding:16px 20px;">
                                    <p style="margin:0; font-size:14px; color:#4B5563;">
                                        Besoin d'aide ? Consultez notre
                                        <a href="{{ $helpUrl }}"
                                            style="color:#059669; font-weight:600; text-decoration:underline;">centre
                                            d'aide</a>
                                        ou contactez-nous à
                                        <a href="mailto:{{ $supportEmail }}"
                                            style="color:#059669; font-weight:600; text-decoration:underline;">{{ $supportEmail }}</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- ==================== PIED DE PAGE ==================== -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:#F9FAFB; border-top:1px solid #E5E7EB;">
                <tr>
                    <td style="padding:24px 30px; text-align:center;">
                        <p style="margin:0; font-size:12px; color:#9CA3AF;">
                            © {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.
                        </p>
                        <p style="margin:8px 0 0; font-size:12px; color:#9CA3AF;">
                            Cet e-mail a été envoyé à {{ $user->email }} suite à la création de votre boutique.
                        </p>
                    </td>
                </tr>
            </table>

        </div>
        <!--[if mso]></td></tr></table><![endif]-->
    </center>
</body>

</html>
