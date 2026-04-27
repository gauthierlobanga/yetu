<?php

namespace App\Filament\Pages\Tenancy;

use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\EditTenantProfile;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class EditVendeurProfile extends EditTenantProfile
{
    public static function getLabel(): string
    {
        return 'Vendeur profile';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                        SpatieMediaLibraryFileUpload::make('tenant_avatar')
                            ->label('Photo de profil Vendeur')
                            ->avatar()
                            ->collection('tenant_avatar')
                            ->disk('public')
                            ->visibility('public')
                            ->directory('Vendeurs/avatars')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->helperText('Taille max: 2MB. Formats: JPG, PNG, WebP')
                            ->columnSpanFull(),
                        TextInput::make('raison_sociale')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, $state) {
                                $set('slug', Str::slug($state));
                            }),
                        TextInput::make('slug'),
            ]);
    }
}
