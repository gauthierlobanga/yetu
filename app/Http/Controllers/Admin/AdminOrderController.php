<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class AdminOrderController extends Controller
{
    /**
     * Génère une facture PDF pour une commande.
     */
    public function invoice(Commande $commande): Response
    {
        // Charger les relations nécessaires
        $commande->load([
            'client',
            'adresseFacturation',
            'adresseLivraison',
            'lignes.produit',
            'lignes.variante',
        ]);

        $pdf = Pdf::loadView('pdf.invoice', [
            'commande' => $commande,
            'company' => [
                'name' => config('app.name'),
                'address' => config('shop.company_address', 'Votre adresse'),
                'email' => config('shop.company_email', 'contact@example.com'),
                'phone' => config('shop.company_phone', '+33 1 23 45 67 89'),
                'siret' => config('shop.company_siret', '123 456 789 00012'),
                'tva' => config('shop.company_tva', 'FR12345678900'),
            ],
        ]);

        // Options PDF
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true, // pour les images distantes
        ]);

        $filename = sprintf('facture-%s-%s.pdf',
            $commande->numero_commande,
            $commande->date_commande->format('Ymd')
        );

        return $pdf->download($filename);
    }
}
