<?php

namespace App\Filament\Resources\UserTenantPivots;

use App\Enums\NavigationGroup;
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
use Illuminate\Support\Facades\Auth;
use UnitEnum;

class UserTenantPivotResource extends Resource
{
    protected static ?string $model = UserTenantPivot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Organisation;

    protected static ?string $recordTitleAttribute = 'tenant_id';

    protected static ?string $navigationLabel = 'Tenant user';

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

    public static function getNavigationBadge(): ?string
    {
        if (Auth::user()->hasRole('super_admin')) {
            return static::getModel()::count();
        }

        return null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        if (Auth::user()->hasRole('super_admin')) {
            return static::getModel()::count() > 10 ? 'success' : 'warning';
        }

        return null;
    }
}
