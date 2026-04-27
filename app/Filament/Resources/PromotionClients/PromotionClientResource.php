<?php

namespace App\Filament\Resources\PromotionClients;

use App\Filament\Clusters\Promotions\PromotionsCluster;
use App\Filament\Resources\PromotionClients\Pages\CreatePromotionClient;
use App\Filament\Resources\PromotionClients\Pages\EditPromotionClient;
use App\Filament\Resources\PromotionClients\Pages\ListPromotionClients;
use App\Filament\Resources\PromotionClients\Schemas\PromotionClientForm;
use App\Filament\Resources\PromotionClients\Tables\PromotionClientsTable;
use App\Models\PromotionClient;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PromotionClientResource extends Resource
{
    protected static ?string $model = PromotionClient::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static ?string $recordTitleAttribute = 'promotion_id';

    protected static ?string $cluster = PromotionsCluster::class;

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return PromotionClientForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PromotionClientsTable::configure($table);
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
            'index' => ListPromotionClients::route('/'),
            'create' => CreatePromotionClient::route('/create'),
            'edit' => EditPromotionClient::route('/{record}/edit'),
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
