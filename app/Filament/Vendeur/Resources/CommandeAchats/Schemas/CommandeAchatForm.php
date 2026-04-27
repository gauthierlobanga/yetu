<?php

namespace App\Filament\Vendeur\Resources\CommandeAchats\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class CommandeAchatForm
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
                Select::make('fournisseur_id')
                    ->relationship('fournisseur', 'id')
                    ->required(),
                TextInput::make('numero_commande')
                    ->required(),
                DatePicker::make('date_commande')
                    ->required(),
                DatePicker::make('date_livraison_prevue'),
                DatePicker::make('date_livraison_reelle'),
                TextInput::make('statut')
                    ->required()
                    ->default('brouillon'),
                TextInput::make('sous_total_ht')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('remise')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('frais_livraison')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('taxe')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('total_ht')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('total_ttc')
                    ->required()
                    ->numeric()
                    ->default(0),
                Textarea::make('notes')
                    ->columnSpanFull(),
                TextInput::make('metadata'),
            ]);
    }
}
