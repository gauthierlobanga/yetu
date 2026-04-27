<?php

namespace App\Filament\Resources\WishlistItems;

use App\Filament\Clusters\Wishlists\WishlistsCluster;
use App\Filament\Resources\WishlistItems\Pages\CreateWishlistItem;
use App\Filament\Resources\WishlistItems\Pages\EditWishlistItem;
use App\Filament\Resources\WishlistItems\Pages\ListWishlistItems;
use App\Filament\Resources\WishlistItems\Schemas\WishlistItemForm;
use App\Filament\Resources\WishlistItems\Tables\WishlistItemsTable;
use App\Models\WishlistItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WishlistItemResource extends Resource
{
    protected static ?string $model = WishlistItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquaresPlus;

    protected static ?string $recordTitleAttribute = 'wishlist_id';

    protected static ?string $cluster = WishlistsCluster::class;

    public static function form(Schema $schema): Schema
    {
        return WishlistItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WishlistItemsTable::configure($table);
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
            'index' => ListWishlistItems::route('/'),
            'create' => CreateWishlistItem::route('/create'),
            'edit' => EditWishlistItem::route('/{record}/edit'),
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
