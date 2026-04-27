<?php

namespace App\Filament\Vendeur\Resources\Vendeurs\Schemas;

use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class VendeurForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('tenant_avatar')
                            ->label('Photo de profil Vendeur')
                            ->image()
                            ->collection('tenant_avatar')
                            ->disk('public')
                            ->visibility('public')
                            ->directory('Vendeurs/avatars')
                            ->acceptedFileTypes(
                                [
                                    'image/jpeg',
                                    'image/png',
                                    'image/webp',
                                    'image/gif',
                                    'image/svg+xml',
                                ]
                            ),
                        TextInput::make('raison_sociale')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, $state) {
                                $set('slug', Str::slug($state));
                            })
                            ->required(),
                        TextInput::make('slug')
                            ->required(),

                        Toggle::make('is_active')
                            ->label('Organisation active')
                            ->default(true)
                            ->onColor('success')
                            ->offColor('danger'),
                    ])->columns(1),
            ]);
    }
}
