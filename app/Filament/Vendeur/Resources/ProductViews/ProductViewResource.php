<?php

namespace App\Filament\Vendeur\Resources\ProductViews;

use App\Enums\NavigationGroup;
use App\Filament\Vendeur\Resources\ProductViews\Pages\ListProductViews;
use App\Filament\Vendeur\Resources\ProductViews\Schemas\ProductViewForm;
use App\Filament\Vendeur\Resources\ProductViews\Tables\ProductViewsTable;
use App\Models\ProductView;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class ProductViewResource extends Resource
{
    protected static ?string $model = ProductView::class;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Share;

    protected static ?string $modelLabel = 'Vue produit';

    protected static ?string $pluralModelLabel = 'Vues produits';

    protected static ?string $recordTitleAttribute = 'product_id';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return ProductViewForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProductViewsTable::configure($table);
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
            'index' => ListProductViews::route('/'),
        ];
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
