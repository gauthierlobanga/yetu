<?php

namespace App\Filament\Resources\CampagneMarketings;

use App\Filament\Clusters\Promotions\PromotionsCluster;
use App\Filament\Resources\CampagneMarketings\Pages\CreateCampagneMarketing;
use App\Filament\Resources\CampagneMarketings\Pages\EditCampagneMarketing;
use App\Filament\Resources\CampagneMarketings\Pages\ListCampagneMarketings;
use App\Filament\Resources\CampagneMarketings\Schemas\CampagneMarketingForm;
use App\Filament\Resources\CampagneMarketings\Tables\CampagneMarketingsTable;
use App\Models\Marketing;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CampagneMarketingResource extends Resource
{
    protected static ?string $model = Marketing::class;

    protected static ?string $navigationLabel = 'Marketing';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    protected static ?string $recordTitleAttribute = 'nom';

    protected static ?string $cluster = PromotionsCluster::class;

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return CampagneMarketingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CampagneMarketingsTable::configure($table);
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
            'index' => ListCampagneMarketings::route('/'),
            'create' => CreateCampagneMarketing::route('/create'),
            'edit' => EditCampagneMarketing::route('/{record}/edit'),
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
