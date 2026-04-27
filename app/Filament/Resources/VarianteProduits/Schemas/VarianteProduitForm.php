<?php

namespace App\Filament\Resources\VarianteProduits\Schemas;

use App\Models\Produit;
use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class VarianteProduitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Informations de la variante')
                    ->icon('heroicon-o-bars-3')
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
                                Select::make('produit_id')
                                    ->label('Produit parent')
                                    ->relationship('produit', 'nom', function ($query) {
                                        return $query->where('statut', Produit::STATUS_PUBLISHED);
                                    })
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->helperText('Sélectionnez le produit auquel cette variante appartient'),

                                TextInput::make('sku_variante')
                                    ->label('SKU')
                                    ->maxLength(100)
                                    ->unique(ignoreRecord: true)
                                    ->helperText('Identifiant unique pour cette variante')
                                    ->prefixIcon('heroicon-m-qr-code'),
                            ]),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('nom')
                                    ->label('Nom de la variante')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Ex: Taille, Couleur, Matière')
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function ($state, callable $set, $get) {
                                        if ($state && $get('valeur')) {
                                            $set('sku_variante', Str::slug($state.'-'.$get('valeur')));
                                        }
                                    })
                                    ->helperText('Type de variante (ex: Taille, Couleur)'),

                                TextInput::make('valeur')
                                    ->label('Valeur')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Ex: M, Rouge, Coton')
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function ($state, callable $set, $get) {
                                        if ($state && $get('nom')) {
                                            $set('sku_variante', Str::slug($get('nom').'-'.$state));
                                        }
                                    })
                                    ->helperText('Valeur spécifique (ex: M, Rouge, Coton)'),
                            ]),
                    ]),

                Section::make('Prix et stock')
                    ->icon('heroicon-o-currency-euro')
                    ->columnSpan(1)
                    ->schema([
                        Grid::make(1)
                            ->schema([
                                TextInput::make('supplement_prix')
                                    ->label('Supplément de prix')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->minValue(0)
                                    ->step(0.01)
                                    ->prefix('€')
                                    ->helperText('Prix additionnel par rapport au produit de base'),

                                TextInput::make('stock')
                                    ->label('Quantité en stock')
                                    ->numeric()
                                    ->required()
                                    ->default(0)
                                    ->minValue(0)
                                    ->helperText('Stock spécifique à cette variante'),
                            ]),
                    ]),

                Section::make('Aperçu du prix')
                    ->icon('heroicon-o-calculator')
                    ->columnSpan(1)
                    ->schema([
                        Placeholder::make('prix_base')
                            ->label('Prix de base du produit')
                            ->content(function ($get) {
                                $produit = Produit::find($get('produit_id'));
                                if ($produit) {
                                    return number_format($produit->prix_ttc, 2).' €';
                                }

                                return 'Non défini';
                            }),

                        Placeholder::make('prix_final')
                            ->label('Prix final de la variante')
                            ->content(function ($get) {
                                $produit = Produit::find($get('produit_id'));
                                $supplement = floatval($get('supplement_prix') ?? 0);
                                if ($produit) {
                                    $prixFinal = $produit->prix_ttc + $supplement;

                                    return number_format($prixFinal, 2).' €';
                                }

                                return 'Non défini';
                            })
                            ->extraAttributes(['class' => 'font-bold text-primary']),
                    ]),

                Section::make('Attributs supplémentaires')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->collapsible()
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        KeyValue::make('attributs')
                            ->label('Propriétés personnalisées')
                            ->keyLabel('Propriété')
                            ->valueLabel('Valeur')
                            ->keyPlaceholder('Ex: Matière')
                            ->valuePlaceholder('Ex: Coton')
                            ->addActionLabel('Ajouter une propriété')
                            ->reorderable()
                            ->helperText('Attributs supplémentaires pour cette variante'),
                    ]),
            ]);
    }
}
