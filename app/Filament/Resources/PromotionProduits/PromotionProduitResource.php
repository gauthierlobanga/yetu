<?php

namespace App\Filament\Resources\PromotionProduits;

use App\Filament\Clusters\Promotions\PromotionsCluster;
use App\Filament\Resources\PromotionProduits\Pages\CreatePromotionProduit;
use App\Filament\Resources\PromotionProduits\Pages\EditPromotionProduit;
use App\Filament\Resources\PromotionProduits\Pages\ListPromotionProduits;
use App\Filament\Resources\PromotionProduits\Schemas\PromotionProduitForm;
use App\Filament\Resources\PromotionProduits\Tables\PromotionProduitsTable;
use App\Models\PromotionProduit;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PromotionProduitResource extends Resource
{
    protected static ?string $model = PromotionProduit::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCube;

    protected static ?string $recordTitleAttribute = 'promotion_id';

    protected static ?string $cluster = PromotionsCluster::class;

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return PromotionProduitForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PromotionProduitsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPromotionProduits::route('/'),
            'create' => CreatePromotionProduit::route('/create'),
            'edit' => EditPromotionProduit::route('/{record}/edit'),
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
