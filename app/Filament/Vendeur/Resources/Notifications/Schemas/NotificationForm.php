<?php

namespace App\Filament\Vendeur\Resources\Notifications\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification')
                    ->icon('heroicon-o-bell')
                    ->columns(2)
                    ->schema([
                        Select::make('commande_id')
                            ->label('Commande')
                            ->relationship('commande', 'numero_commande')
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('sujet')
                            ->label('Sujet')
                            ->maxLength(255),
                        Select::make('type')
                            ->label('Type')
                            ->options([
                                'email' => 'Email',
                                'sms' => 'SMS',
                                'push' => 'Push',
                            ])
                            ->required()
                            ->default('email'),
                        Select::make('statut')
                            ->label('Statut')
                            ->options([
                                'en_attente' => 'En attente',
                                'envoye' => 'Envoyé',
                                'echec' => 'Échoué',
                                'lu' => 'Lu',
                            ])
                            ->required()
                            ->default('en_attente'),
                    ]),
                Section::make('Contenu')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        KeyValue::make('contenu')
                            ->label('Contenu du message')
                            ->columnSpanFull()
                            ->required(),
                        KeyValue::make('metadata')
                            ->label('Métadonnées')
                            ->columnSpanFull(),
                    ]),
                Section::make('Destinataire et dates')
                    ->icon('heroicon-o-user')
                    ->columns(2)
                    ->schema([
                        TextInput::make('notifiable_type')
                            ->label('Type de destinataire')
                            ->required(),
                        TextInput::make('notifiable_id')
                            ->label('ID Destinataire')
                            ->required(),
                        DateTimePicker::make('date_envoi')
                            ->label('Date d\'envoi'),
                        DateTimePicker::make('date_lecture')
                            ->label('Date de lecture'),
                    ]),
            ]);
    }
}
