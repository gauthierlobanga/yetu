<?php

namespace App\Filament\Resources\VisitorEvents;

use App\Enums\NavigationGroup;
use App\Filament\Resources\VisitorEvents\Pages\ListVisitorEvents;
use App\Filament\Resources\VisitorEvents\Schemas\VisitorEventForm;
use App\Filament\Resources\VisitorEvents\Tables\VisitorEventsTable;
use App\Models\VisitorEvent;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class VisitorEventResource extends Resource
{
    protected static ?string $model = VisitorEvent::class;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Share;

    protected static ?string $modelLabel = 'Événement visiteur';

    protected static ?string $pluralModelLabel = 'Événements visiteurs';

    protected static ?string $recordTitleAttribute = 'event_type';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return VisitorEventForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VisitorEventsTable::configure($table);
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
            'index' => ListVisitorEvents::route('/'),
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
