<?php

namespace App\Filament\Vendeur\Resources\SystemNotifications;

use App\Filament\Vendeur\Resources\SystemNotifications\Pages\CreateSystemNotification;
use App\Filament\Vendeur\Resources\SystemNotifications\Pages\EditSystemNotification;
use App\Filament\Vendeur\Resources\SystemNotifications\Pages\ListSystemNotifications;
use App\Filament\Vendeur\Resources\SystemNotifications\Pages\ViewSystemNotification;
use App\Filament\Vendeur\Resources\SystemNotifications\Schemas\SystemNotificationForm;
use App\Filament\Vendeur\Resources\SystemNotifications\Schemas\SystemNotificationInfolist;
use App\Filament\Vendeur\Resources\SystemNotifications\Tables\SystemNotificationsTable;
use App\Models\SystemNotification;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SystemNotificationResource extends Resource
{
    protected static ?string $model = SystemNotification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBellAlert;

    protected static \UnitEnum|string|null $navigationGroup = 'Notifications';

    protected static ?string $modelLabel = 'Notification système';

    protected static ?string $pluralModelLabel = 'Notifications système';

    protected static ?string $recordTitleAttribute = 'type';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereNull('read_at')->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        $count = static::getModel()::whereNull('read_at')->count();

        return match (true) {
            $count > 5 => 'danger',
            $count > 0 => 'warning',
            default => 'success',
        };
    }

    public static function form(Schema $schema): Schema
    {
        return SystemNotificationForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return SystemNotificationInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SystemNotificationsTable::configure($table);
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
            'index' => ListSystemNotifications::route('/'),
            'create' => CreateSystemNotification::route('/create'),
            'view' => ViewSystemNotification::route('/{record}'),
            'edit' => EditSystemNotification::route('/{record}/edit'),
        ];
    }
}
