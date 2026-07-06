<?php

namespace App\Filament\Vendeur\Resources\SystemNotifications\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SystemNotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification')
                    ->icon('heroicon-o-bell-alert')
                    ->schema([
                        TextInput::make('type')
                            ->label('Type de notification')
                            ->required(),
                        KeyValue::make('data')
                            ->label('Données')
                            ->columnSpanFull()
                            ->required(),
                        DateTimePicker::make('read_at')
                            ->label('Lu le'),
                    ]),
                Section::make('Destinataire')
                    ->icon('heroicon-o-user')
                    ->columns(2)
                    ->schema([
                        TextInput::make('notifiable_type')
                            ->label('Type de destinataire')
                            ->required(),
                        TextInput::make('notifiable_id')
                            ->label('ID Destinataire')
                            ->required(),
                    ]),
            ]);
    }
}
