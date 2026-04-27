<?php

namespace App\Filament\Resources\TypeDocumentLegals\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TypeDocumentLegalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required(),
                TextInput::make('nom')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('autorite_emettrice'),
                Toggle::make('est_obligatoire')
                    ->required(),
                TextInput::make('ordre')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
