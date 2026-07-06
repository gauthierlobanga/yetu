<?php

namespace App\Filament\Vendeur\Resources\ProductCategories\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;

class ProductCategoryInfolist
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
                                Section::make('Détails de la catégorie')
                                    ->schema([
                                        TextEntry::make('nom')
                                            ->label('Nom de la catégorie')
                                            ->size(TextSize::Large)
                                            ->weight('bold'),
                                        TextEntry::make('description')
                                            ->label('Description')
                                            ->html()
                                            ->columnSpanFull(),
                                        TextEntry::make('slug')
                                            ->label('Slug')
                                            ->color('gray'),
                                    ])->columns(2),

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
                                Section::make('Média')
                                    ->schema([
                                        ImageEntry::make('image')
                                            ->label('Image de couverture')
                                            ->square(),
                                        ImageEntry::make('icone')
                                            ->label('Icône')
                                            ->circular(),
                                    ]),

                                Section::make('Statut & Hiérarchie')
                                    ->schema([
                                        IconEntry::make('is_active')
                                            ->label('Active')
                                            ->boolean(),
                                        IconEntry::make('is_featured')
                                            ->label('Mise en avant')
                                            ->boolean(),
                                        TextEntry::make('parent.nom')
                                            ->label('Catégorie Parente')
                                            ->badge()
                                            ->color('primary')
                                            ->placeholder('Aucune (Catégorie racine)'),
                                    ])->columns(2),
                            ]),
                    ]),
            ]);
    }
}
