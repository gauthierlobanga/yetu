<?php

namespace App\Filament\Vendeur\Resources\Paniers\Schemas;

use App\Models\Client;
use App\Models\Produit;
use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Number;

class PanierForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()
                    ->columnSpan(2)
                    ->schema([
                        Section::make('Informations du panier')
                            ->icon('heroicon-o-shopping-cart')
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
                                        Select::make('client_id')
                                            ->label('Client')
                                            ->relationship('client', 'nom', fn ($query) => $query->select('id', 'nom', 'prenom', 'email'))
                                            ->searchable(['nom', 'prenom', 'email'])
                                            ->preload()
                                            ->live()
                                            ->afterStateUpdated(function ($state, callable $set) {
                                                if ($state) {
                                                    $client = Client::find($state);
                                                    if ($client) {
                                                        $set('client_email', $client->email);
                                                        $set('client_phone', $client->telephone);
                                                    }
                                                }
                                            }),

                                        Select::make('user_id')
                                            ->label('Utilisateur (staff)')
                                            ->relationship('user', 'name')
                                            ->searchable(['name', 'email'])
                                            ->preload(),

                                        TextInput::make('session_id')
                                            ->label('ID de session')
                                            ->maxLength(255)
                                            ->helperText('Pour les paniers des visiteurs non connectés'),

                                        ToggleButtons::make('statut')
                                            ->label('Statut')
                                            ->options([
                                                'actif' => 'Actif',
                                                'abandonne' => 'Abandonné',
                                                'converti' => 'Converti',
                                                'expire' => 'Expiré',
                                            ])
                                            ->colors([
                                                'actif' => 'success',
                                                'abandonne' => 'warning',
                                                'converti' => 'info',
                                                'expire' => 'danger',
                                            ])
                                            ->icons([
                                                'actif' => 'heroicon-o-shopping-cart',
                                                'abandonne' => 'heroicon-o-x-circle',
                                                'converti' => 'heroicon-o-check-circle',
                                                'expire' => 'heroicon-o-clock',
                                            ])
                                            ->inline()
                                            ->default('actif')
                                            ->required(),
                                    ]),
                                Grid::make(2)
                                    ->schema([
                                        DateTimePicker::make('date_creation')
                                            ->label('Date de création')
                                            ->required()
                                            ->default(now())
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),

                                        DateTimePicker::make('date_modification')
                                            ->label('Dernière modification')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),
                                    ]),
                            ]),
                        Section::make('Dates importantes')
                            ->icon('heroicon-o-calendar')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        DateTimePicker::make('date_creation')
                                            ->label('Date de création')
                                            ->required()
                                            ->default(now())
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),

                                        DateTimePicker::make('date_modification')
                                            ->label('Dernière modification')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),
                                    ]),
                            ]),
                    ]),

                Group::make()
                    ->columnSpan(1)
                    ->schema([
                        Section::make('Récapitulatif des montants')
                            ->icon('heroicon-o-calculator')
                            ->schema([
                                TextInput::make('sous_total')
                                    ->label('Sous-total')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $get, callable $set) {
                                        $taxes = floatval($get('total_taxes') ?? 0);
                                        $livraison = floatval($get('total_livraison') ?? 0);
                                        $remises = floatval($get('total_remises') ?? 0);
                                        $set('total_general', $state + $taxes + $livraison - $remises);
                                    }),

                                TextInput::make('total_taxes')
                                    ->label('Taxes')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $get, callable $set) {
                                        $subtotal = floatval($get('sous_total') ?? 0);
                                        $livraison = floatval($get('total_livraison') ?? 0);
                                        $remises = floatval($get('total_remises') ?? 0);
                                        $set('total_general', $subtotal + $state + $livraison - $remises);
                                    }),

                                TextInput::make('total_livraison')
                                    ->label('Frais de livraison')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $get, callable $set) {
                                        $subtotal = floatval($get('sous_total') ?? 0);
                                        $taxes = floatval($get('total_taxes') ?? 0);
                                        $remises = floatval($get('total_remises') ?? 0);
                                        $set('total_general', $subtotal + $taxes + $state - $remises);
                                    }),

                                TextInput::make('total_remises')
                                    ->label('Remises')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $get, callable $set) {
                                        $subtotal = floatval($get('sous_total') ?? 0);
                                        $taxes = floatval($get('total_taxes') ?? 0);
                                        $livraison = floatval($get('total_livraison') ?? 0);
                                        $set('total_general', $subtotal + $taxes + $livraison - $state);
                                    }),

                                TextInput::make('total_general')
                                    ->label('Total général')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->disabled()
                                    ->dehydrated(),

                                Placeholder::make('total_lettres')
                                    ->label('Montant en lettres')
                                    ->content(fn ($get) => Number::spell($get('total_general') ?? 0, 'fr'))
                                    ->visible(fn ($get) => ($get('total_general') ?? 0) > 0),
                            ]),
                    ]),

                Group::make()
                    ->columnSpanFull()
                    ->schema([
                        Section::make('Dates importantes')
                            ->icon('heroicon-o-calendar')
                            ->collapsible()
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        DateTimePicker::make('date_abandon')
                                            ->label("Date d'abandon")
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),

                                        DateTimePicker::make('date_conversion')
                                            ->label('Date de conversion')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),

                                        DateTimePicker::make('expires_at')
                                            ->label('Expire le')
                                            ->native(false)
                                            ->displayFormat('d/m/Y H:i'),
                                    ]),
                            ]),

                        Section::make('Articles du panier')
                            ->icon('heroicon-o-shopping-bag')
                            ->schema([
                                Repeater::make('items')
                                    ->label('Articles')
                                    ->relationship('items')
                                    ->schema([
                                        Grid::make(4)
                                            ->schema([
                                                Select::make('produit_id')
                                                    ->label('Produit')
                                                    ->relationship('produit', 'nom')
                                                    ->searchable()
                                                    ->preload()
                                                    ->required()
                                                    ->live()
                                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                                        if ($state) {
                                                            $produit = Produit::find($state);
                                                            if ($produit) {
                                                                $set('prix_unitaire', $produit->prix_ttc);
                                                                $quantite = floatval($get('quantite') ?? 1);
                                                                $set('prix_total', $produit->prix_ttc * $quantite);
                                                            }
                                                        }
                                                    }),

                                                TextInput::make('quantite')
                                                    ->label('Quantité')
                                                    ->numeric()
                                                    ->required()
                                                    ->default(1)
                                                    ->minValue(1)
                                                    ->live()
                                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                                        $prixUnitaire = floatval($get('prix_unitaire') ?? 0);
                                                        $set('prix_total', $prixUnitaire * $state);
                                                    }),

                                                TextInput::make('prix_unitaire')
                                                    ->label('Prix unitaire')
                                                    ->numeric()
                                                    ->required()
                                                    ->step(0.01)
                                                    ->prefix('€'),

                                                TextInput::make('prix_total')
                                                    ->label('Total')
                                                    ->numeric()
                                                    ->required()
                                                    ->step(0.01)
                                                    ->prefix('€')
                                                    ->disabled()
                                                    ->dehydrated(),
                                            ]),
                                    ])
                                    ->columns(1)
                                    ->addActionLabel('Ajouter un article')
                                    ->defaultItems(0)
                                    ->collapsible(),
                            ]),
                    ]),
            ]);
    }
}
