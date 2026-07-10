<?php

namespace App\Filament\Vendeur\Resources\DeliveryTrackings;

use App\Filament\Vendeur\Resources\DeliveryTrackings\Pages\CreateDeliveryTracking;
use App\Filament\Vendeur\Resources\DeliveryTrackings\Pages\EditDeliveryTracking;
use App\Filament\Vendeur\Resources\DeliveryTrackings\Pages\ListDeliveryTrackings;
use App\Filament\Vendeur\Resources\DeliveryTrackings\Schemas\DeliveryTrackingForm;
use App\Filament\Vendeur\Resources\DeliveryTrackings\Tables\DeliveryTrackingsTable;
use App\Models\DeliveryTracking;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DeliveryTrackingResource extends Resource
{
    protected static ?string $model = DeliveryTracking::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'commande_id';

    public static function form(Schema $schema): Schema
    {
        return DeliveryTrackingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DeliveryTrackingsTable::configure($table);
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
            'index' => ListDeliveryTrackings::route('/'),
            'create' => CreateDeliveryTracking::route('/create'),
            'edit' => EditDeliveryTracking::route('/{record}/edit'),
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
