<?php

namespace App\Filament\Vendeur\Resources\Produits;

use App\Filament\Vendeur\Clusters\Products\ProductsCluster;
use App\Filament\Vendeur\Resources\Produits\Pages\CreateProduit;
use App\Filament\Vendeur\Resources\Produits\Pages\EditProduit;
use App\Filament\Vendeur\Resources\Produits\Pages\ListProduits;
use App\Filament\Vendeur\Resources\Produits\Pages\ViewProduit;
use App\Filament\Vendeur\Resources\Produits\RelationManagers\AvisRelationManager;
use App\Filament\Vendeur\Resources\Produits\RelationManagers\VariantesRelationManager;
use App\Filament\Vendeur\Resources\Produits\Schemas\ProduitForm;
use App\Filament\Vendeur\Resources\Produits\Tables\ProduitsTable;
use App\Models\Produit;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProduitResource extends Resource
{
    protected static ?string $model = Produit::class;

    protected static ?string $cluster = ProductsCluster::class;

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'nom';

    protected static bool $isScopedToTenant = false;

    public static function form(Schema $schema): Schema
    {
        return ProduitForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProduitsTable::configure($table);
    }

    public static function infolist(Schema $schema): Schema
    {
        return Schemas\ProduitInfolist::configure($schema);
    }

    public static function getRelations(): array
    {
        return [
            VariantesRelationManager::class,
            AvisRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProduits::route('/'),
            'create' => CreateProduit::route('/create'),
            'view' => ViewProduit::route('/{record}'),
            'edit' => EditProduit::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return static::getModel()::count() > 10 ? 'success' : 'warning';
    }
}
