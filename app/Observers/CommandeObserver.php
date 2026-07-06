<?php

namespace App\Observers;

use App\Models\Commande;
use App\Models\ProgrammeFidelite;
use App\Models\TransactionFidelite;

class CommandeObserver
{
    /**
     * Handle the Commande "created" event.
     */
    public function created(Commande $commande): void
    {
        // S'il arrive qu'une commande soit créée directement comme terminée
        if ($commande->statut === Commande::STATUT_TERMINE) {
            $this->attribuerPointsFidelite($commande);
        }
    }

    /**
     * Handle the Commande "updated" event.
     */
    public function updated(Commande $commande): void
    {
        // Vérifier si le statut vient de passer à 'termine'
        if ($commande->isDirty('statut') && $commande->statut === Commande::STATUT_TERMINE) {
            $this->attribuerPointsFidelite($commande);
        }

        // Retirer les points si la commande est annulée après coup
        if ($commande->isDirty('statut') && in_array($commande->statut, [Commande::STATUT_ANNULE, Commande::STATUT_REJETE])) {
            $this->annulerPointsFidelite($commande);
        }
    }

    /**
     * Calcule et attribue les points de fidélité pour une commande terminée.
     */
    private function attribuerPointsFidelite(Commande $commande): void
    {
        $client = $commande->client;
        if (! $client) {
            return;
        }

        // On récupère le programme de fidélité actif
        $programme = ProgrammeFidelite::actifs()->first();
        if (! $programme) {
            return; // Aucun programme de fidélité actif
        }

        $compte = $client->compteFidelite;
        // Créer le compte fidélité s'il n'existe pas
        if (! $compte) {
            $compte = $client->compteFidelite()->create([
                'programme_fidelite_id' => $programme->id,
                'points' => 0,
                'points_cumules' => 0,
                'niveau' => 'bronze',
            ]);
        }

        // On évite d'attribuer 2 fois les points pour la même commande
        $transactionExistante = $compte->transactions()
            ->where('type', TransactionFidelite::TYPE_GAIN)
            ->where('metadata->commande_id', $commande->id)
            ->exists();

        if ($transactionExistante) {
            return;
        }

        $pointsGagnes = $programme->calculerPointsGagnes($commande->total);

        if ($pointsGagnes > 0) {
            $compte->ajouterPoints(
                $pointsGagnes,
                "Points gagnés pour la commande #{$commande->numero_commande}",
                $commande
            );
        }
    }

    /**
     * Annule les points attribués si la commande est annulée ou rejetée.
     */
    private function annulerPointsFidelite(Commande $commande): void
    {
        $client = $commande->client;
        if (! $client || ! $client->compteFidelite) {
            return;
        }

        $compte = $client->compteFidelite;

        // Trouver la transaction de gain liée à cette commande
        $transactionGain = $compte->transactions()
            ->where('type', TransactionFidelite::TYPE_GAIN)
            ->where('metadata->commande_id', $commande->id)
            ->first();

        if ($transactionGain) {
            // Vérifier si elle a déjà été annulée
            $dejaAnnulee = $compte->transactions()
                ->where('type', TransactionFidelite::TYPE_AJUSTEMENT)
                ->where('metadata->transaction_annulee_id', $transactionGain->id)
                ->exists();

            if ($dejaAnnulee) {
                return;
            }

            // Créer une transaction d'ajustement négatif
            TransactionFidelite::create([
                'compte_fidelite_id' => $compte->id,
                'type' => TransactionFidelite::TYPE_AJUSTEMENT,
                'points' => -$transactionGain->points,
                'raison' => "Annulation commande #{$commande->numero_commande}",
                'metadata' => [
                    'commande_id' => $commande->id,
                    'transaction_annulee_id' => $transactionGain->id,
                ],
                'date_transaction' => now(),
            ]);

            // Mettre à jour le solde (on diminue le solde courant, et on peut aussi diminuer les points cumulés
            // pour ajuster la barre de progression, mais on le fait seulement si c'est pertinent)
            $compte->points = max(0, $compte->points - $transactionGain->points);
            $compte->points_cumules = max(0, $compte->points_cumules - $transactionGain->points);
            $compte->save();
        }
    }
}
