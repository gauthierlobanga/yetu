<?php

namespace App\Filament\Resources\CommandeAchats;

use App\Filament\Clusters\Achats\AchatsCluster;
use App\Filament\Resources\CommandeAchats\Pages\CreateCommandeAchat;
use App\Filament\Resources\CommandeAchats\Pages\EditCommandeAchat;
use App\Filament\Resources\CommandeAchats\Pages\ListCommandeAchats;
use App\Filament\Resources\CommandeAchats\Schemas\CommandeAchatForm;
use App\Filament\Resources\CommandeAchats\Tables\CommandeAchatsTable;
use App\Models\CommandeAchat;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CommandeAchatResource extends Resource
{
    protected static ?string $model = CommandeAchat::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    protected static ?string $recordTitleAttribute = 'numero_commande';

    protected static ?string $navigationLabel = 'Achats';

    protected static ?string $cluster = AchatsCluster::class;

    public static function form(Schema $schema): Schema
    {
        return CommandeAchatForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CommandeAchatsTable::configure($table);
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
            'index' => ListCommandeAchats::route('/'),
            'create' => CreateCommandeAchat::route('/create'),
            'edit' => EditCommandeAchat::route('/{record}/edit'),
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
