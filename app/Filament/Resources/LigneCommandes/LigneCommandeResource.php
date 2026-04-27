<?php

namespace App\Filament\Resources\LigneCommandes;

use App\Filament\Clusters\Commandes\CommandesCluster;
use App\Filament\Resources\LigneCommandes\Pages\CreateLigneCommande;
use App\Filament\Resources\LigneCommandes\Pages\EditLigneCommande;
use App\Filament\Resources\LigneCommandes\Pages\ListLigneCommandes;
use App\Filament\Resources\LigneCommandes\Schemas\LigneCommandeForm;
use App\Filament\Resources\LigneCommandes\Tables\LigneCommandesTable;
use App\Models\LigneCommande;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LigneCommandeResource extends Resource
{
    protected static ?string $model = LigneCommande::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $recordTitleAttribute = 'commande_id';

    protected static ?string $cluster = CommandesCluster::class;

    public static function form(Schema $schema): Schema
    {
        return LigneCommandeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LigneCommandesTable::configure($table);
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
            'index' => ListLigneCommandes::route('/'),
            'create' => CreateLigneCommande::route('/create'),
            'edit' => EditLigneCommande::route('/{record}/edit'),
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
