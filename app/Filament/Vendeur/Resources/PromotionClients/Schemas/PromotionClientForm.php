<?php

namespace App\Filament\Vendeur\Resources\PromotionClients\Schemas;

use App\Models\Client;
use App\Models\Promotion;
use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class PromotionClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Informations')
                    ->icon('heroicon-o-user-group')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)
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
                                Select::make('promotion_id')
                                    ->label('Promotion')
                                    ->relationship('promotion', 'code')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        if ($state) {
                                            $promotion = Promotion::find($state);
                                            if ($promotion) {
                                                $set('promotion_valeur', $promotion->valeur);
                                                $set('promotion_type', $promotion->type);
                                            }
                                        }
                                    }),

                                Select::make('client_id')
                                    ->label('Client')
                                    ->relationship('client', 'nom')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        if ($state) {
                                            $client = Client::find($state);
                                            if ($client) {
                                                $set('client_email', $client->email);
                                            }
                                        }
                                    }),

                                TextInput::make('utilisations')
                                    ->label('Utilisations actuelles')
                                    ->numeric()
                                    ->default(0)
                                    ->minValue(0)
                                    ->disabled()
                                    ->dehydrated(),

                                TextInput::make('utilisations_max')
                                    ->label('Utilisations max')
                                    ->numeric()
                                    ->minValue(1)
                                    ->nullable()
                                    ->helperText('Laissez vide pour illimité'),

                                Grid::make(2)
                                    ->schema([
                                        DateTimePicker::make('premiere_utilisation')
                                            ->label('Première utilisation')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i')
                                            ->disabled()
                                            ->dehydrated(false),

                                        DateTimePicker::make('derniere_utilisation')
                                            ->label('Dernière utilisation')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i')
                                            ->disabled()
                                            ->dehydrated(false),
                                    ]),

                                ToggleButtons::make('est_actif')
                                    ->label('Actif')
                                    ->options([
                                        true => 'Actif',
                                        false => 'Inactif',
                                    ])
                                    ->colors([
                                        true => 'success',
                                        false => 'danger',
                                    ])
                                    ->icons([
                                        true => 'heroicon-o-check-circle',
                                        false => 'heroicon-o-x-circle',
                                    ])
                                    ->inline()
                                    ->default(true),

                                Textarea::make('notes')
                                    ->label('Notes')
                                    ->rows(2)
                                    ->placeholder('Informations supplémentaires sur cette attribution...'),
                            ]),
                    ]),
            ]);
    }
}
