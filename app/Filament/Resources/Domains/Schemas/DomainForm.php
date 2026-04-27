<?php

namespace App\Filament\Resources\Domains\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DomainForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('domain')
                    ->required(),
                Select::make('tenant_id')
                    ->relationship('tenant', 'raison_sociale')
                    ->preload()
                    ->searchable()
                    ->required(),
            ]);
    }
}
