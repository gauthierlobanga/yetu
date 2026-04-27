<?php

namespace App\Filament\Resources\UserTenantPivots;

use App\Filament\Resources\UserTenantPivots\Pages\CreateUserTenantPivot;
use App\Filament\Resources\UserTenantPivots\Pages\EditUserTenantPivot;
use App\Filament\Resources\UserTenantPivots\Pages\ListUserTenantPivots;
use App\Filament\Resources\UserTenantPivots\Schemas\UserTenantPivotForm;
use App\Filament\Resources\UserTenantPivots\Tables\UserTenantPivotsTable;
use App\Models\UserTenantPivot;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserTenantPivotResource extends Resource
{
    protected static ?string $model = UserTenantPivot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'tenant_id';

    public static function form(Schema $schema): Schema
    {
        return UserTenantPivotForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserTenantPivotsTable::configure($table);
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
            'index' => ListUserTenantPivots::route('/'),
            'create' => CreateUserTenantPivot::route('/create'),
            'edit' => EditUserTenantPivot::route('/{record}/edit'),
        ];
    }
}
