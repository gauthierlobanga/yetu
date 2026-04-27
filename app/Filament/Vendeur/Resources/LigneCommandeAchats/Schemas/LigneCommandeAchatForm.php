<?php

namespace App\Filament\Vendeur\Resources\LigneCommandeAchats\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class LigneCommandeAchatForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
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
                Select::make('commande_achat_id')
                    ->relationship('commandeAchat', 'id')
                    ->required(),
                Select::make('produit_id')
                    ->relationship('produit', 'id')
                    ->required(),
                TextInput::make('quantite')
                    ->required()
                    ->numeric(),
                TextInput::make('quantite_recue')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('prix_unitaire_ht')
                    ->required()
                    ->numeric(),
                TextInput::make('total_ht')
                    ->required()
                    ->numeric(),
                TextInput::make('tva')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('metadata'),
            ]);
    }
}
