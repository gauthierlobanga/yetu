<?php

namespace App\Filament\Vendeur\Resources\SystemNotifications\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SystemNotificationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification')
                    ->icon('heroicon-o-bell-alert')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('type')
                            ->label('Type')
                            ->formatStateUsing(fn (string $state): string => class_basename($state))
                            ->badge(),
                        TextEntry::make('read_at')
                            ->label('Statut')
                            ->dateTime('d/m/Y H:i')
                            ->placeholder('Non lu')
                            ->icon(fn ($state) => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                            ->color(fn ($state) => $state ? 'success' : 'warning'),
                        TextEntry::make('created_at')
                            ->label('Créée le')
                            ->dateTime('d/m/Y H:i'),
                        TextEntry::make('updated_at')
                            ->label('Modifiée le')
                            ->dateTime('d/m/Y H:i'),
                    ]),
                Section::make('Données')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        TextEntry::make('data')
                            ->label('Contenu')
                            ->formatStateUsing(fn ($state) => '<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.875rem;">'.json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE).'</pre>')
                            ->html()
                            ->columnSpanFull(),
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
            ]);
    }
}
