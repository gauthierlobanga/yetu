<?php

namespace App\Filament\Resources\Entrepots;

use App\Filament\Clusters\Inventor\InventorCluster;
use App\Filament\Resources\Entrepots\Pages\CreateEntrepot;
use App\Filament\Resources\Entrepots\Pages\EditEntrepot;
use App\Filament\Resources\Entrepots\Pages\ListEntrepots;
use App\Filament\Resources\Entrepots\Schemas\EntrepotForm;
use App\Filament\Resources\Entrepots\Tables\EntrepotsTable;
use App\Models\Entrepot;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class EntrepotResource extends Resource
{
    protected static ?string $model = Entrepot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingStorefront;

    protected static ?string $cluster = InventorCluster::class;

    protected static ?string $recordTitleAttribute = 'nom';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return static::getModel()::count() > 10 ? 'success' : 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return EntrepotForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EntrepotsTable::configure($table);
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
            'index' => ListEntrepots::route('/'),
            'create' => CreateEntrepot::route('/create'),
            'edit' => EditEntrepot::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
