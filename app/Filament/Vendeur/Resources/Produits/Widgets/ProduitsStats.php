<?php

namespace App\Filament\Vendeur\Resources\Produits\Widgets;

use App\Models\Produit;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProduitsStats extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected function getStats(): array
    {
        // ---- Statistiques de base ----
        $total = Produit::count();
        $publies = Produit::where('statut', 'publie')->count();
        $brouillons = Produit::where('statut', 'brouillon')->count();
        $enRupture = Produit::where('statut', 'out_of_stock')->count();
        $abandonnes = Produit::where('statut', 'discontinued')->count();

        // ---- Stock ----
        $stockTotal = Produit::sum('quantite_stock');
        $stockAlerte = Produit::whereColumn('quantite_stock', '<=', 'seuil_alerte')
            ->where('statut', 'publie')
            ->count();

        // ---- Promotions ----
        $enPromotion = Produit::whereNotNull('prix_promotion')
            ->whereColumn('prix_promotion', '<', 'prix_ttc')
            ->count();

        $dealDuJour = Produit::where('is_deal_of_the_day', true)
            ->where('statut', 'publie')
            ->count();

        // ---- Performance ----
        $totalVentes = Produit::sum('sold_count');
        $totalVues = Produit::sum('views_count');
        $noteMoyenne = Produit::where('reviews_count', '>', 0)
            ->average('average_rating') ?? 0;

        // ---- Produits phares ----
        $meilleuresVentes = Produit::where('is_bestseller', true)
            ->where('statut', 'publie')
            ->count();

        $nouveautes = Produit::where('is_new', true)
            ->where('statut', 'publie')
            ->count();
        $aLaUne = Produit::where('is_featured', true)
            ->where('statut', 'publie')
            ->count();

        // ---- Médias ----
        $avecImages = Produit::whereHas('media', function ($q) {
            $q->whereIn('collection_name', ['image_principale', 'images']);
        })->count();

        // ---- Programmation ----
        $enAttente = Produit::whereNotNull('scheduled_for')
            ->where('scheduled_for', '>', now())
            ->where('statut', 'brouillon')
            ->count();

        $expires = Produit::whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->where('statut', 'publie')
            ->count();

        return [
            Stat::make('Total produits', $total)
                ->description('Tous statuts confondus')
                ->descriptionIcon('heroicon-o-shopping-bag', 'before')
                ->color('gray')
                ->icon('heroicon-o-shopping-bag'),

            Stat::make('Publiés', $publies)
                ->description($brouillons . ' brouillons, ' . $abandonnes . ' abandonnés')
                ->descriptionIcon('heroicon-o-check-circle', 'before')
                ->color('success')
                ->icon('heroicon-o-check-circle'),

            Stat::make('Rupture de stock', $enRupture)
                ->description($stockAlerte . ' produits sous seuil d\'alerte')
                ->descriptionIcon('heroicon-o-exclamation-circle', 'before')
                ->color('danger')
                ->icon('heroicon-o-exclamation-circle'),

            Stat::make('En promotion', $enPromotion)
                ->description($dealDuJour . ' deals du jour')
                ->descriptionIcon('heroicon-o-tag', 'before')
                ->color('warning')
                ->icon('heroicon-o-tag'),

            Stat::make('Ventes totales', number_format($totalVentes))
                ->description($noteMoyenne > 0 ? 'Note moyenne : ' . number_format($noteMoyenne, 1) . '/5' : 'Pas encore d\'avis')
                ->descriptionIcon('heroicon-o-star', 'before')
                ->color('blue')
                ->icon('heroicon-o-arrow-trending-up'),

            Stat::make('Vues totales', number_format($totalVues))
                ->description($aLaUne . ' à la une, ' . $nouveautes . ' nouveautés')
                ->descriptionIcon('heroicon-o-eye', 'before')
                ->color('indigo')
                ->icon('heroicon-o-eye'),

            Stat::make('Produits avec images', $avecImages)
                ->description(round(($avecImages / max($total, 1)) * 100) . '% du catalogue')
                ->descriptionIcon('heroicon-o-photo', 'before')
                ->color('teal')
                ->icon('heroicon-o-photo'),

            Stat::make('Programmés / expirés', $enAttente . ' en attente, ' . $expires . ' expirés')
                ->description('À surveiller')
                ->descriptionIcon('heroicon-o-clock', 'before')
                ->color('purple')
                ->icon('heroicon-o-clock'),
        ];
    }

    protected function getColumns(): int
    {
        return 4;
    }
}
