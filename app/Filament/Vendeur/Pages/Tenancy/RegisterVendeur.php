<?php

namespace App\Filament\Vendeur\Vendeur\Pages\Tenancy;

use App\Models\Tenant;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
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
                SpatieMediaLibraryFileUpload::make('tenant_avatar')
                    ->label('Logo de la boutique')
                    ->image()
                    ->collection('tenant_avatar')
                    ->disk('public')
                    ->visibility('public')
                    ->directory('tenants/avatars')
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
                    ->columnSpanFull(),

                Section::make('Informations générales')
                    ->schema([
                        TextInput::make('raison_sociale')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        Select::make('type_entite')
                            ->label('Type d\'entité')
                            ->options(Tenant::getTypesEntite())
                            ->preload()
                            ->searchable()
                            ->required(),

                        TextInput::make('email')
                            ->email()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                    ])
                    ->columns(2),
                Section::make('Informations générales')
                    ->schema([

                        TextInput::make('telephone')
                            ->tel()
                            ->maxLength(255),

                        TextInput::make('domain')
                            ->url()
                            ->label('Domaine personnalisé')
                            ->prefix('https://')
                            ->prefixIcon(Heroicon::OutlinedGlobeAlt)
                            ->prefixIconColor('success')
                            ->suffix('.com')
                            ->maxLength(255)
                            ->helperText('Ex: maboutique.cd (laissez vide pour utiliser le sous-domaine automatique)'),
                    ])
                    ->columns(1),

                Section::make('Statut & Activation')
                    ->schema([
                        Select::make('statut')
                            ->options(Tenant::getStatuts())
                            ->preload()
                            ->searchable()
                            ->default('en_attente')
                            ->required(),

                        Toggle::make('is_active')
                            ->label('Compte actif')
                            ->default(false),

                        DateTimePicker::make('date_activation')
                            ->label('Date d\'activation'),
                        DateTimePicker::make('date_expiration')
                            ->label('Date d\'expiration'),
                    ])
                    ->columns(2),

                Section::make('Configuration avancée')
                    ->schema([
                        KeyValue::make('configuration')
                            ->label('Paramètres personnalisés')
                            ->keyLabel('Clé')
                            ->valueLabel('Valeur')
                            ->addActionLabel('Ajouter un paramètre'),
                    ]),
            ]);
    }

    protected function handleRegistration(array $data): Tenant
    {
        $tenant = Tenant::create($data);

        $tenant->users()->attach(Auth::user());

        return $tenant;
    }
}
