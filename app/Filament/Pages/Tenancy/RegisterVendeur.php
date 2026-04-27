<?php

namespace App\Filament\Pages\Tenancy;

use App\Models\Tenant;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RegisterVendeur extends RegisterTenant
{
    public static function getLabel(): string
    {
        return 'Register Vendeur';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('avatar')
                            ->label('Photo de profil Vendeur')
                            ->avatar()
                            ->collection('tenant_avatar')
                            ->disk('public')
                            ->visibility('public')
                            ->directory('Vendeurs/avatars')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->helperText('Taille max: 2MB. Formats: JPG, PNG, WebP')
                            ->columns(3),
                        TextInput::make('raison_sociale')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, $state) {
                                $set('slug', Str::slug($state));
                            }),
                        TextInput::make('slug'),
                    ])->columnSpan(1),
            ]);
    }

    protected function handleRegistration(array $data): Tenant
    {
        $tenant = Tenant::create($data);

        $tenant->users()->attach(Auth::user());

        return $tenant;
    }
}
