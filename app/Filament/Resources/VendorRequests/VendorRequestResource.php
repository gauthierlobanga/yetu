<?php

namespace App\Filament\Resources\VendorRequests;

use App\Filament\Resources\VendorRequests\Pages\CreateVendorRequest;
use App\Filament\Resources\VendorRequests\Pages\EditVendorRequest;
use App\Filament\Resources\VendorRequests\Pages\ListVendorRequests;
use App\Filament\Resources\VendorRequests\Schemas\VendorRequestForm;
use App\Filament\Resources\VendorRequests\Tables\VendorRequestsTable;
use App\Models\VendorRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VendorRequestResource extends Resource
{
    protected static ?string $model = VendorRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'shop_name';

    public static function form(Schema $schema): Schema
    {
        return VendorRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VendorRequestsTable::configure($table);
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
            'index' => ListVendorRequests::route('/'),
            'create' => CreateVendorRequest::route('/create'),
            'edit' => EditVendorRequest::route('/{record}/edit'),
        ];
    }
}
