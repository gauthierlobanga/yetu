<?php

namespace App\Filament\Vendeur\Resources\Produits\Pages;

use App\Filament\Vendeur\Resources\Produits\ProduitResource;
use App\Filament\Vendeur\Resources\Produits\Widgets\ProduitsStats;
use App\Models\Produit;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;

class ListProduits extends ListRecords
{
    protected static string $resource = ProduitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ProduitsStats::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            // -------- Tous --------
            'all' => Tab::make('Tous')
                ->badge(Produit::count())
                ->badgeColor('gray')
                ->icon('heroicon-m-document-text')
                ->iconPosition(IconPosition::Before),

            // -------- Statut --------
            'published' => Tab::make('Publiés')
                ->badge(Produit::where('statut', Produit::STATUS_PUBLISHED)->count())
                ->badgeColor('success')
                ->icon('heroicon-m-check-circle')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', Produit::STATUS_PUBLISHED)),

            'draft' => Tab::make('Brouillons')
                ->badge(Produit::where('statut', Produit::STATUS_DRAFT)->count())
                ->badgeColor('gray')
                ->icon('heroicon-m-pencil-square')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', Produit::STATUS_DRAFT)),

            'out_of_stock' => Tab::make('Rupture de stock')
                ->badge(Produit::where('statut', Produit::STATUS_OUT_OF_STOCK)->count())
                ->badgeColor('danger')
                ->icon('heroicon-m-x-circle')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', Produit::STATUS_OUT_OF_STOCK)),

            'discontinued' => Tab::make('Abandonnés')
                ->badge(Produit::where('statut', Produit::STATUS_DISCONTINUED)->count())
                ->badgeColor('danger')
                ->icon('heroicon-m-archive-box')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', Produit::STATUS_DISCONTINUED)),

            // -------- Stock --------
            'low_stock' => Tab::make('Stock faible')
                ->badge(Produit::whereColumn('quantite_stock', '<=', 'seuil_alerte')
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('warning')
                ->icon('heroicon-m-exclamation-triangle')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereColumn('quantite_stock', '<=', 'seuil_alerte')
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            'in_stock' => Tab::make('En stock')
                ->badge(Produit::where('quantite_stock', '>', 0)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('info')
                ->icon('heroicon-m-check-badge')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('quantite_stock', '>', 0)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            // -------- Promotions --------
            'on_sale' => Tab::make('En promotion')
                ->badge(Produit::whereNotNull('prix_promotion')
                    ->whereColumn('prix_promotion', '<', 'prix_ttc')
                    ->count())
                ->badgeColor('warning')
                ->icon('heroicon-m-tag')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereNotNull('prix_promotion')
                    ->whereColumn('prix_promotion', '<', 'prix_ttc')
                ),

            'deal_of_the_day' => Tab::make('Deal du jour')
                ->badge(Produit::where('is_deal_of_the_day', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('primary')
                ->icon('heroicon-m-fire')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('is_deal_of_the_day', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            // -------- Produits phares --------
            'featured' => Tab::make('À la une')
                ->badge(Produit::where('is_featured', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('indigo')
                ->icon('heroicon-m-star')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('is_featured', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            'new' => Tab::make('Nouveautés')
                ->badge(Produit::where('is_new', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('info')
                ->icon('heroicon-m-sparkles')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('is_new', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            'bestseller' => Tab::make('Meilleures ventes')
                ->badge(Produit::where('is_bestseller', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('amber')
                ->icon('heroicon-m-trophy')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('is_bestseller', true)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            // -------- Performance --------
            'top_rated' => Tab::make('Mieux notés')
                ->badge(Produit::where('average_rating', '>=', 4.0)
                    ->where('reviews_count', '>', 0)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('success')
                ->icon('heroicon-m-star')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->where('average_rating', '>=', 4.0)
                    ->where('reviews_count', '>', 0)
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            'most_viewed' => Tab::make('Les plus vus')
                ->badge(Produit::orderBy('views_count', 'desc')
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->limit(1)
                    ->count()) // juste pour l'affichage, on prend le premier
                ->badgeColor('gray')
                ->icon('heroicon-m-eye')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->orderBy('views_count', 'desc')
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            // -------- Images --------
            'with_images' => Tab::make('Avec images')
                ->badge(Produit::whereHas('media', function ($q) {
                    $q->whereIn('collection_name', ['image_principale', 'images']);
                })->count())
                ->badgeColor('teal')
                ->icon('heroicon-m-photo')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereHas('media', function ($q) {
                        $q->whereIn('collection_name', ['image_principale', 'images']);
                    })
                ),

            // -------- Programmation --------
            'scheduled' => Tab::make('Programmés')
                ->badge(Produit::whereNotNull('scheduled_for')
                    ->where('scheduled_for', '>', now())
                    ->where('statut', Produit::STATUS_DRAFT)
                    ->count())
                ->badgeColor('warning')
                ->icon('heroicon-m-clock')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereNotNull('scheduled_for')
                    ->where('scheduled_for', '>', now())
                    ->where('statut', Produit::STATUS_DRAFT)
                ),

            'expired' => Tab::make('Expirés')
                ->badge(Produit::whereNotNull('expires_at')
                    ->where('expires_at', '<', now())
                    ->where('statut', Produit::STATUS_PUBLISHED)
                    ->count())
                ->badgeColor('danger')
                ->icon('heroicon-m-clock')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereNotNull('expires_at')
                    ->where('expires_at', '<', now())
                    ->where('statut', Produit::STATUS_PUBLISHED)
                ),

            // -------- Périodes --------
            'this_week' => Tab::make('Cette semaine')
                ->badge(Produit::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ),

            'last_month' => Tab::make('Mois dernier')
                ->badge(Produit::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query
                    ->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])
                ),
        ];
    }

    public function getDefaultActiveTab(): string|int|null
    {
        return 'published'; // ou 'all' selon votre préférence
    }
}
