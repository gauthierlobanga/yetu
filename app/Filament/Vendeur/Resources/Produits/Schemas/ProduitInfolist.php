<?php

namespace App\Filament\Vendeur\Resources\Produits\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;

class ProduitInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)
                    ->schema([
                        Group::make()
                            ->columnSpan(2)
                            ->schema([
                                Section::make('Détails du produit')
                                    ->schema([
                                        TextEntry::make('nom')
                                            ->label('Nom')
                                            ->size(TextSize::Large)
                                            ->weight('bold'),
                                        TextEntry::make('description_courte')
                                            ->label('Description courte')
                                            ->color('gray')
                                            ->html(),
                                        TextEntry::make('description')
                                            ->label('Description complète')
                                            ->html()
                                            ->columnSpanFull(),
                                    ])->columns(2),

                                Section::make('Images & Médias')
                                    ->schema([
                                        ImageEntry::make('images')
                                            ->label('Images du produit')
                                            ->circular()
                                            ->stacked()
                                            ->limit(5)
                                            ->columnSpanFull(),
                                    ]),

                                Section::make('SEO & Référencement')
                                    ->schema([
                                        TextEntry::make('meta_titre')
                                            ->label('Meta Titre'),
                                        TextEntry::make('meta_description')
                                            ->label('Meta Description'),
                                    ])->columns(2),
                            ]),

                        Group::make()
                            ->columnSpan(1)
                            ->schema([
                                Section::make('Prix & Inventaire')
                                    ->schema([
                                        TextEntry::make('prix')
                                            ->label('Prix de vente')
                                            ->money('EUR')
                                            ->size(TextSize::Large)
                                            ->weight('bold')
                                            ->color('primary'),
                                        TextEntry::make('prix_comparaison')
                                            ->label('Prix de comparaison')
                                            ->money('EUR')
                                            ->color('gray'),
                                        TextEntry::make('stock')
                                            ->label('En stock')
                                            ->badge()
                                            ->color(fn (int $state): string => match (true) {
                                                $state > 10 => 'success',
                                                $state > 0 => 'warning',
                                                default => 'danger',
                                            }),
                                        TextEntry::make('sku')
                                            ->label('SKU'),
                                        TextEntry::make('code_barre')
                                            ->label('Code-barres (EAN/UPC)'),
                                    ]),

                                Section::make('Catégorisation')
                                    ->schema([
                                        TextEntry::make('categorie.nom')
                                            ->label('Catégorie principale'),
                                        TextEntry::make('categories.nom')
                                            ->label('Autres catégories')
                                            ->badge(),
                                        TextEntry::make('marque.nom')
                                            ->label('Marque'),
                                    ]),

                                Section::make('Statut')
                                    ->schema([
                                        IconEntry::make('is_active')
                                            ->label('Actif')
                                            ->boolean(),
                                        IconEntry::make('is_featured')
                                            ->label('Mis en avant')
                                            ->boolean(),
                                    ])->columns(2),
                            ]),
                    ]),
            ]);
    }
}
