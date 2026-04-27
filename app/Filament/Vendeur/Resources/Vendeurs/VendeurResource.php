<?php

namespace App\Filament\Vendeur\Resources\Vendeurs;

// use App\Filament\Concerns\ExclureFromResources;
use App\Filament\Vendeur\Resources\Vendeurs\Pages\CreateVendeur;
use App\Filament\Vendeur\Resources\Vendeurs\Pages\EditVendeur;
use App\Filament\Vendeur\Resources\Vendeurs\Pages\ListVendeurs;
use App\Filament\Vendeur\Resources\Vendeurs\Schemas\VendeurForm;
use App\Filament\Vendeur\Resources\Vendeurs\Tables\VendeursTable;
use App\Models\Tenant;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VendeurResource extends Resource
{
    // use ExclureFromResources;

    protected static ?string $model = Tenant::class;

    protected static string|null|\UnitEnum $navigationGroup = 'Tenants';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $tenantOwnershipRelationshipName = 'users';

    public static function form(Schema $schema): Schema
    {
        return VendeurForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VendeursTable::configure($table);
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
            'index' => ListVendeurs::route('/'),
            'create' => CreateVendeur::route('/create'),
            'edit' => EditVendeur::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::count() > 10 ? 'success' : 'danger';
    }
}
