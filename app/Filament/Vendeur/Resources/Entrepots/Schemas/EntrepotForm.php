<?php

namespace App\Filament\Vendeur\Resources\Entrepots\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class EntrepotForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Informations générales')
                    ->icon('heroicon-o-building-storefront')
                    ->columnSpan(1)
                    ->schema([
                        Grid::make(1)
                            ->schema([
                                Select::make('tenant_id')
                                    ->label('Organisation')
                                    ->relationship('tenant', 'raison_sociale')
                                    ->preload()
                                    ->searchable()
                                    ->options(function () {
                                        $user = Auth::user();

                                        // Si l'utilisateur est Super Admin, il voit toutes les Vendeurs
                                        if ($user->hasRole(['super_admin'])) {
                                            return Tenant::pluck('raison_sociale', 'id');
                                        }

                                        // Sinon, il voit seulement ses Vendeurs
                                        return $user->tenants()->pluck('raison_sociale', 'tenants.id');
                                    })
                                    ->default(function () {
                                        $user = Auth::user();

                                        // Si on est dans un contexte tenant, pré-remplir avec la Vendeur actuelle
                                        if (Filament::hasTenancy() && Filament::getTenant()) {
                                            return Filament::getTenant()->id;
                                        }

                                        // Si l'utilisateur n'a qu'une seule Vendeur, la sélectionner par défaut
                                        if ($user->tenants()->count() === 1) {
                                            return $user->tenants()->first()->id;
                                        }

                                        return null;
                                    })
                                    ->required(),
                                TextInput::make('nom')
                                    ->label('Nom de l\'entrepôt')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Entrepôt principal'),

                                Textarea::make('adresse')
                                    ->label('Adresse')
                                    ->required()
                                    ->rows(3)
                                    ->placeholder('1 rue des Entrepôts\n75001 Paris'),

                                TextInput::make('telephone')
                                    ->label('Téléphone')
                                    ->tel()
                                    ->maxLength(20)
                                    ->placeholder('+33 1 23 45 67 89')
                                    ->prefixIcon('heroicon-m-phone'),

                                TextInput::make('email')
                                    ->label('Email')
                                    ->email()
                                    ->maxLength(255)
                                    ->placeholder('contact@entrepot.com')
                                    ->prefixIcon('heroicon-m-envelope'),

                                ToggleButtons::make('est_principal')
                                    ->label('Entrepôt principal')
                                    ->options([
                                        true => 'Oui',
                                        false => 'Non',
                                    ])
                                    ->colors([
                                        true => 'success',
                                        false => 'gray',
                                    ])
                                    ->icons([
                                        true => 'heroicon-o-star',
                                        false => 'heroicon-o-x-mark',
                                    ])
                                    ->inline()
                                    ->default(false)
                                    ->helperText('Un seul entrepôt peut être principal'),
                            ]),
                    ]),

                Section::make('Configuration avancée')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->columnSpan(1)
                    ->collapsible()
                    ->schema([
                        KeyValue::make('configuration')
                            ->label('Paramètres de configuration')
                            ->keyLabel('Paramètre')
                            ->valueLabel('Valeur')
                            ->addActionLabel('Ajouter un paramètre')
                            ->reorderable()
                            ->helperText('Ex: capacite_max: 1000, horaires: 9h-18h'),
                    ]),
            ]);
    }
}
