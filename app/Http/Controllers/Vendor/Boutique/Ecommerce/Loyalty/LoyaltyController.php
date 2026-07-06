<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Loyalty;

use App\Http\Controllers\Controller;
use App\Models\ProgrammeFidelite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant le programme de fidélité pour les clients de la boutique.
 *
 * Permet d'afficher les points cumulés du client, son niveau actuel,
 * et de traiter l'échange de ses points contre des récompenses ou remises.
 */
class LoyaltyController extends Controller
{
    /**
     * Affiche le tableau de bord de fidélité du client.
     *
     * Crée automatiquement un programme par défaut et un compte fidélité
     * pour le client s'ils n'existent pas encore. Retourne la vue Inertia
     * avec l'historique des transactions de points.
     *
     * @return Response
     */
    public function loyaltyIndex()
    {
        $client = Auth::user()->client;
        abort_unless($client, 404);

        // Récupère le premier programme de fidélité (sans filtre sur est_actif)
        $programmeDefaut = ProgrammeFidelite::first();

        // Si aucun programme n'existe, on en crée un par défaut
        if (! $programmeDefaut) {
            $programmeDefaut = ProgrammeFidelite::create([
                'nom' => 'Programme standard',
                'type' => ProgrammeFidelite::TYPE_POINTS,
                'regles' => [
                    'seuils' => [
                        'bronze' => 0,
                        'argent' => 500,
                        'or' => 2000,
                        'platine' => 5000,
                        'diamant' => 10000,
                    ],
                    'gain' => [
                        'type' => 'montant',
                        'valeur' => 1,    // 1 € = 1 point
                        'points' => 1,
                    ],
                    'taux_conversion' => 100, // 100 points = 1 €
                ],
                'recompenses' => [],
                'date_debut' => null,
                'date_fin' => null,
            ]);
        }

        // Créer le compte fidélité du client s'il n'existe pas déjà
        $compte = $client->compteFidelite ?? $client->compteFidelite()->create([
            'programme_fidelite_id' => $programmeDefaut->id,
            'points' => 0,
            'points_cumules' => 0,
            'niveau' => 'bronze',
        ]);

        return Inertia::render('Vendor/boutique/Loyalty/Index', [
            'compte' => $compte->load('transactions'),
            'programme' => $programmeDefaut,
        ]);
    }

    /**
     * Traite une demande d'utilisation (échange) de points de fidélité.
     *
     * Vérifie la validité du solde du client et effectue la transaction
     * d'échange. Redirige ensuite vers la page avec un message de succès ou d'erreur.
     *
     * @param  Request  $request  La requête HTTP contenant les points à échanger.
     * @return RedirectResponse
     */
    public function loyaltyRedeem(Request $request)
    {
        $client = Auth::user()->client;
        $compte = $client->compteFidelite;

        if (! $compte) {
            return back()->with('error', 'Aucun compte fidélité');
        }

        $points = (int) $request->input('points', 0);

        if ($points <= 0) {
            return back()->with('error', 'Montant de points invalide.');
        }

        if ($compte->utiliserPoints($points, 'Échange de points')) {
            return back()->with('success', "$points points échangés.");
        }

        return back()->with('error', 'Points insuffisants.');
    }
}
