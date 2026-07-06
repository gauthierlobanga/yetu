<?php

namespace App\Filament\Vendeur\Resources\Clients;

use App\Enums\NavigationGroup;
use App\Filament\Vendeur\Resources\Clients\Pages\CreateClient;
use App\Filament\Vendeur\Resources\Clients\Pages\EditClient;
use App\Filament\Vendeur\Resources\Clients\Pages\ListClients;
use App\Filament\Vendeur\Resources\Clients\Pages\ViewClient;
use App\Filament\Vendeur\Resources\Clients\RelationManagers\AdressesRelationManager;
use App\Filament\Vendeur\Resources\Clients\RelationManagers\CommandesRelationManager;
use App\Filament\Vendeur\Resources\Clients\Schemas\ClientForm;
use App\Filament\Vendeur\Resources\Clients\Tables\ClientsTable;
use App\Models\Client;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class ClientResource extends Resource
{
    protected static ?string $model = Client::class;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Profile;

    protected static ?string $recordTitleAttribute = 'nom';

    protected static bool $isScopedToTenant = false;

    public static function form(Schema $schema): Schema
    {
        return ClientForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profil du client')
                    ->icon('heroicon-o-user')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('full_name')
                            ->label('Nom complet')
                            ->weight('bold')
                            ->size('large'),
                        TextEntry::make('email')
                            ->label('Email')
                            ->icon('heroicon-m-envelope')
                            ->copyable(),
                        TextEntry::make('telephone')
                            ->label('Téléphone')
                            ->icon('heroicon-m-phone')
                            ->placeholder('Non renseigné'),
                        TextEntry::make('total_spent')
                            ->label('Total dépensé')
                            ->money('EUR')
                            ->icon('heroicon-m-banknotes')
                            ->color('success'),
                        TextEntry::make('commandes_count')
                            ->label('Nombre de commandes')
                            ->icon('heroicon-m-shopping-bag')
                            ->state(function ($record): int {
                                return $record->commandes()->count();
                            }),
                        TextEntry::make('created_at')
                            ->label('Client depuis')
                            ->dateTime('d/m/Y')
                            ->icon('heroicon-m-calendar'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return ClientsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            CommandesRelationManager::class,
            AdressesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListClients::route('/'),
            'create' => CreateClient::route('/create'),
            'view' => ViewClient::route('/{record}'),
            'edit' => EditClient::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
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
