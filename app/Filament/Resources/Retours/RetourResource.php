<?php

namespace App\Filament\Resources\Retours;

use App\Filament\Clusters\Commandes\CommandesCluster;
use App\Filament\Resources\Retours\Pages\CreateRetour;
use App\Filament\Resources\Retours\Pages\EditRetour;
use App\Filament\Resources\Retours\Pages\ListRetours;
use App\Filament\Resources\Retours\Schemas\RetourForm;
use App\Filament\Resources\Retours\Tables\RetoursTable;
use App\Models\Retour;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RetourResource extends Resource
{
    protected static ?string $model = Retour::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowUturnLeft;

    protected static ?string $recordTitleAttribute = 'reference';

    protected static ?string $cluster = CommandesCluster::class;

    public static function form(Schema $schema): Schema
    {
        return RetourForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RetoursTable::configure($table);
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
            'index' => ListRetours::route('/'),
            'create' => CreateRetour::route('/create'),
            'edit' => EditRetour::route('/{record}/edit'),
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
