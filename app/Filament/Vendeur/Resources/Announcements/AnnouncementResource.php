<?php

namespace App\Filament\Vendeur\Resources\Announcements;

use App\Filament\Vendeur\Resources\Announcements\Pages\CreateAnnouncement;
use App\Filament\Vendeur\Resources\Announcements\Pages\EditAnnouncement;
use App\Filament\Vendeur\Resources\Announcements\Pages\ListAnnouncements;
use App\Filament\Vendeur\Resources\Announcements\Schemas\AnnouncementForm;
use App\Filament\Vendeur\Resources\Announcements\Tables\AnnouncementsTable;
use App\Models\Announcement;
use BackedEnum;
use Filament\Facades\Filament;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AnnouncementResource extends Resource
{
    protected static ?string $model = Announcement::class;

    protected static ?string $modelLabel = 'Annonce boutique';

    protected static ?string $pluralModelLabel = 'Annonces boutique';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    public static function form(Schema $schema): Schema
    {
        return AnnouncementForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AnnouncementsTable::configure($table);
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
            'index' => ListAnnouncements::route('/'),
            'create' => CreateAnnouncement::route('/create'),
            'edit' => EditAnnouncement::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('tenant_id', \Filament\Facades\Filament::getTenant()?->id);
    }
}
