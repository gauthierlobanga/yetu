<?php

namespace App\Filament\Vendeur\Resources\DeliveryEvents;

use App\Filament\Vendeur\Resources\DeliveryEvents\Pages\CreateDeliveryEvent;
use App\Filament\Vendeur\Resources\DeliveryEvents\Pages\EditDeliveryEvent;
use App\Filament\Vendeur\Resources\DeliveryEvents\Pages\ListDeliveryEvents;
use App\Filament\Vendeur\Resources\DeliveryEvents\Schemas\DeliveryEventForm;
use App\Filament\Vendeur\Resources\DeliveryEvents\Tables\DeliveryEventsTable;
use App\Models\DeliveryEvent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DeliveryEventResource extends Resource
{
    protected static ?string $model = DeliveryEvent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return DeliveryEventForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DeliveryEventsTable::configure($table);
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
            'index' => ListDeliveryEvents::route('/'),
            'create' => CreateDeliveryEvent::route('/create'),
            'edit' => EditDeliveryEvent::route('/{record}/edit'),
        ];
    }
}
