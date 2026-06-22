<?php

namespace App\Filament\Resources\VisitorEvents\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VisitorEventForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Événement')
                    ->icon('heroicon-o-bolt')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('event_type')
                            ->label('Type')
                            ->content(fn ($record) => $record?->event_type ?? '-'),
                        Placeholder::make('url')
                            ->label('URL')
                            ->content(fn ($record) => $record?->url ?? '-'),
                        Placeholder::make('value')
                            ->label('Valeur')
                            ->content(fn ($record) => $record?->value ?? '0'),
                        Placeholder::make('occurred_at')
                            ->label('Date')
                            ->content(fn ($record) => $record?->occurred_at?->format('d/m/Y H:i:s') ?? '-'),
                    ]),

                Section::make('Identifiants')
                    ->icon('heroicon-o-finger-print')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('visitor_id')
                            ->label('Visiteur')
                            ->content(fn ($record) => $record?->visitor_id ?? '-'),
                        Placeholder::make('session_id')
                            ->label('Session')
                            ->content(fn ($record) => $record?->session_id ?? '-'),
                        Placeholder::make('product_id')
                            ->label('Produit')
                            ->content(fn ($record) => $record?->product_id ?? '—'),
                        Placeholder::make('order_id')
                            ->label('Commande')
                            ->content(fn ($record) => $record?->order_id ?? '—'),
                    ]),
            ]);
    }
}
