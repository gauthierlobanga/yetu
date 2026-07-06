<?php

namespace App\Filament\Vendeur\Resources\Notifications;

use App\Filament\Vendeur\Resources\Notifications\Pages\CreateNotification;
use App\Filament\Vendeur\Resources\Notifications\Pages\EditNotification;
use App\Filament\Vendeur\Resources\Notifications\Pages\ListNotifications;
use App\Filament\Vendeur\Resources\Notifications\Pages\ViewNotification;
use App\Filament\Vendeur\Resources\Notifications\Schemas\NotificationForm;
use App\Filament\Vendeur\Resources\Notifications\Schemas\NotificationInfolist;
use App\Filament\Vendeur\Resources\Notifications\Tables\NotificationsTable;
use App\Models\Notification;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NotificationResource extends Resource
{
    protected static ?string $model = Notification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBell;

    protected static \UnitEnum|string|null $navigationGroup = 'Notifications';

    protected static ?string $modelLabel = 'Commande';

    protected static ?string $pluralModelLabel = 'Commandes';

    protected static ?string $recordTitleAttribute = 'sujet';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('statut', 'en_attente')->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        $count = static::getModel()::where('statut', 'en_attente')->count();

        return match (true) {
            $count > 5 => 'danger',
            $count > 0 => 'warning',
            default => 'success',
        };
    }

    public static function form(Schema $schema): Schema
    {
        return NotificationForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NotificationInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NotificationsTable::configure($table);
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
            'index' => ListNotifications::route('/'),
            'create' => CreateNotification::route('/create'),
            'view' => ViewNotification::route('/{record}'),
            'edit' => EditNotification::route('/{record}/edit'),
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
