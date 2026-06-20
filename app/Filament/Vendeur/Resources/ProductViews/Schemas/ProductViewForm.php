<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductViewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Détails de la vue')
                    ->icon('heroicon-o-eye')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('product_id')
                            ->label('Produit')
                            ->content(fn ($record) => $record?->product_id ?? '-'),
                        Placeholder::make('url')
                            ->label('URL')
                            ->content(fn ($record) => $record?->url ?? '-'),
                        Placeholder::make('visitor_id')
                            ->label('Visiteur')
                            ->content(fn ($record) => $record?->visitor_id ?? '-'),
                        Placeholder::make('session_id')
                            ->label('Session')
                            ->content(fn ($record) => $record?->session_id ?? '-'),
                    ]),

                Section::make('Horodatage')
                    ->icon('heroicon-o-clock')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('viewed_at')
                            ->label('Consulté le')
                            ->content(fn ($record) => $record?->viewed_at?->format('d/m/Y H:i:s') ?? '-'),
                        Placeholder::make('created_at')
                            ->label('Créé le')
                            ->content(fn ($record) => $record?->created_at?->format('d/m/Y H:i:s') ?? '-'),
                    ]),
            ]);
    }
}
