<?php

namespace App\Filament\Vendeur\Resources\Announcements\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AnnouncementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->options([
                        'info' => 'Information',
                        'success' => 'Succès',
                        'warning' => 'Avertissement',
                        'danger' => 'Urgent / Danger',
                        'promo' => 'Promotion',
                        'feature' => 'Nouveauté',
                    ])
                    ->default('info')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                Textarea::make('message')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('action_text')
                    ->label('Texte du bouton (optionnel)'),
                TextInput::make('action_url')
                    ->label('Lien URL (optionnel)')
                    ->url(),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('ends_at'),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
