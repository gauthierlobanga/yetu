<?php

namespace App\Filament\Vendeur\Resources\Visits\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VisitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Navigation')
                    ->icon('heroicon-o-globe-alt')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('url')
                            ->label('URL')
                            ->content(fn ($record) => $record?->url ?? '-'),
                        Placeholder::make('path')
                            ->label('Chemin')
                            ->content(fn ($record) => $record?->path ?? '-'),
                        Placeholder::make('method')
                            ->label('Méthode')
                            ->content(fn ($record) => $record?->method ?? '-'),
                        Placeholder::make('referrer')
                            ->label('Référent')
                            ->content(fn ($record) => $record?->referrer ?? 'Direct'),
                    ]),

                Section::make('Visiteur')
                    ->icon('heroicon-o-user')
                    ->columns(3)
                    ->schema([
                        Placeholder::make('ip')
                            ->label('Adresse IP')
                            ->content(fn ($record) => $record?->ip ?? '-'),
                        Placeholder::make('device')
                            ->label('Appareil')
                            ->content(fn ($record) => $record?->device ?? '-'),
                        Placeholder::make('browser')
                            ->label('Navigateur')
                            ->content(fn ($record) => $record?->browser ?? '-'),
                        Placeholder::make('platform')
                            ->label('Plateforme')
                            ->content(fn ($record) => $record?->platform ?? '-'),
                        Placeholder::make('language')
                            ->label('Langue')
                            ->content(fn ($record) => $record?->language ?? '-'),
                        Placeholder::make('duration')
                            ->label('Durée (sec)')
                            ->content(fn ($record) => $record?->duration ?? 0),
                    ]),

                Section::make('Horodatage')
                    ->icon('heroicon-o-clock')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('visited_at')
                            ->label('Visité le')
                            ->content(fn ($record) => $record?->visited_at?->format('d/m/Y H:i:s') ?? '-'),
                        Placeholder::make('created_at')
                            ->label('Créé le')
                            ->content(fn ($record) => $record?->created_at?->format('d/m/Y H:i:s') ?? '-'),
                    ]),
            ]);
    }
}
