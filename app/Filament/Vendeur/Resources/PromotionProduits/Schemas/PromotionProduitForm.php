<?php

namespace App\Filament\Vendeur\Resources\PromotionProduits\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class PromotionProduitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Informations')
                    ->icon('heroicon-o-ticket')
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
                                    ->required(),

                                Select::make('produit_id')
                                    ->label('Produit')
                                    ->relationship('produit', 'nom')
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                TextInput::make('valeur_specifique')
                                    ->label('Valeur spécifique')
                                    ->numeric()
                                    ->step(0.01)
                                    ->helperText('Laissez vide pour utiliser la valeur par défaut'),

                                TextInput::make('quantite_minimale')
                                    ->label('Quantité minimale')
                                    ->numeric()
                                    ->default(1)
                                    ->minValue(1),

                                TextInput::make('quantite_maximale')
                                    ->label('Quantité maximale')
                                    ->numeric()
                                    ->nullable()
                                    ->minValue(1),

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
                            ]),
                    ]),
            ]);
    }
}
