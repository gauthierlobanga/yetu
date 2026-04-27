<?php

namespace App\Filament\Resources\Inventaires;

use App\Filament\Clusters\Inventor\InventorCluster;
use App\Filament\Resources\Inventaires\Pages\CreateInventaire;
use App\Filament\Resources\Inventaires\Pages\EditInventaire;
use App\Filament\Resources\Inventaires\Pages\ListInventaires;
use App\Filament\Resources\Inventaires\Schemas\InventaireForm;
use App\Filament\Resources\Inventaires\Tables\InventairesTable;
use App\Models\Inventaire;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InventaireResource extends Resource
{
    protected static ?string $model = Inventaire::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static ?string $cluster = InventorCluster::class;

    protected static ?string $recordTitleAttribute = 'reference';

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
        return InventaireForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return InventairesTable::configure($table);
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
            'index' => ListInventaires::route('/'),
            'create' => CreateInventaire::route('/create'),
            'edit' => EditInventaire::route('/{record}/edit'),
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
