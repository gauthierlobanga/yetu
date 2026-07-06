<?php

namespace App\Filament\Vendeur\Resources\Notifications\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NotificationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification de commande')
                    ->icon('heroicon-o-bell')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('commande.numero_commande')
                            ->label('N° Commande')
                            ->copyable()
                            ->weight('bold')
                            ->icon('heroicon-o-shopping-bag'),
                        TextEntry::make('sujet')
                            ->label('Sujet')
                            ->weight('bold'),
                        TextEntry::make('type')
                            ->label('Type')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'email' => 'info',
                                'sms' => 'warning',
                                'push' => 'success',
                                default => 'gray',
                            }),
                        TextEntry::make('statut')
                            ->label('Statut')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'en_attente' => 'warning',
                                'envoye' => 'success',
                                'echec' => 'danger',
                                'lu' => 'info',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'en_attente' => 'En attente',
                                'envoye' => 'Envoyé',
                                'echec' => 'Échoué',
                                'lu' => 'Lu',
                                default => $state,
                            }),
                        TextEntry::make('date_envoi')
                            ->label('Envoyée le')
                            ->dateTime('d/m/Y H:i')
                            ->placeholder('Non envoyée'),
                        TextEntry::make('date_lecture')
                            ->label('Lue le')
                            ->dateTime('d/m/Y H:i')
                            ->placeholder('Non lue'),
                    ]),
                Section::make('Contenu')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        TextEntry::make('contenu')
                            ->label('Message')
                            ->formatStateUsing(fn ($state) => '<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.875rem;">'.json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE).'</pre>')
                            ->html()
                            ->columnSpanFull(),
                        TextEntry::make('metadata')
                            ->label('Métadonnées')
                            ->formatStateUsing(fn ($state) => '<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.875rem;">'.json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE).'</pre>')
                            ->html()
                            ->columnSpanFull()
                            ->placeholder('Aucune métadonnée'),
                    ]),
                Section::make('Destinataire')
                    ->icon('heroicon-o-user')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('notifiable_type')
                            ->label('Type')
                            ->formatStateUsing(fn (string $state): string => class_basename($state)),
                        TextEntry::make('notifiable_id')
                            ->label('ID')
                            ->copyable(),
                    ]),
                Section::make('Dates')
                    ->icon('heroicon-o-clock')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Créée le')
                            ->dateTime('d/m/Y H:i'),
                        TextEntry::make('updated_at')
                            ->label('Modifiée le')
                            ->dateTime('d/m/Y H:i'),
                    ]),
            ]);
    }
}
