<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

/**
 * Contrôleur gérant les opérations d'administration liées aux commandes.
 *
 * Ce contrôleur fournit les fonctionnalités nécessaires pour qu'un administrateur
 * puisse manipuler et gérer les commandes, notamment la génération et le téléchargement
 * de factures au format PDF.
 */
class AdminOrderController extends Controller
{
    /**
     * Génère et télécharge une facture PDF pour une commande spécifique.
     *
     * Cette méthode charge les relations nécessaires (client, adresses, lignes de produits),
     * prépare les données de l'entreprise (nom, adresse, SIRET, TVA, etc.), et génère
     * un document PDF structuré pour la commande fournie. Le PDF est ensuite
     * renvoyé sous forme de téléchargement direct.
     *
     * @param  Commande  $commande  L'instance de la commande pour laquelle générer la facture.
     * @return Response Le fichier PDF généré prêt à être téléchargé.
     */
    public function adminOrdersInvoice(Commande $commande): Response
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
                'address' => config('company_address', 'Votre adresse'),
                'email' => config('company_email', 'contact@example.com'),
                'phone' => config('company_phone', '+33 1 23 45 67 89'),
                'siret' => config('company_siret', '123 456 789 00012'),
                'tva' => config('company_tva', 'FR12345678900'),
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
