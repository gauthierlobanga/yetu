<?php

namespace App\Filament\Resources\TenantDocumentLegals\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TenantDocumentLegalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('tenant_id')
                    ->relationship('tenant', 'raison_sociale')
                    ->preload()
                    ->searchable()
                    ->required(),
                Select::make('type_document_id')
                    ->relationship('typeDocument', 'code')
                    ->preload()
                    ->searchable()
                    ->required(),
                TextInput::make('numero_document'),
                DatePicker::make('date_delivrance')->native(false),
                DatePicker::make('date_expiration')->native(false),
                TextInput::make('lieu_delivrance'),
                TextInput::make('autorite_delivrance'),
                KeyValue::make('metadata')
                    ->label('Meta données')
                    ->keyLabel('Type')
                    ->valueLabel('Valeur')
                    ->disabled()
                    ->dehydrated(false)
                    ->visible(fn ($record) => $record !== null),
                Toggle::make('est_verifie')
                    ->required(),
                DateTimePicker::make('verifie_le')->native(false),
                Select::make('verifie_par')
                    ->relationship('verifiePar', 'name')
                    ->preload()
                    ->searchable()
                    ->required(),
            ]);
    }
}
