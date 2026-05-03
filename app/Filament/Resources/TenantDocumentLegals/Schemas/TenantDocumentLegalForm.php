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
                    ->label('Boutique (tenant)')
                    ->relationship('tenant', 'raison_sociale')
                    ->preload()
                    ->searchable()
                    ->required(),

                Select::make('vendor_request_id')
                    ->label('Demande d\'inscription')
                    ->relationship('vendorRequest', 'shop_name')
                    ->preload()
                    ->searchable()
                    ->disabled()
                    ->dehydrated(true)
                    ->visible(fn ($record) => $record && $record->vendor_request_id),

                Select::make('type_document_id')
                    ->label('Type de document')
                    ->relationship('typeDocument', 'nom')
                    ->preload()
                    ->searchable()
                    ->required(),

                TextInput::make('numero_document')
                    ->label('Numéro de document')
                    ->maxLength(100),

                DatePicker::make('date_delivrance')
                    ->label('Date de délivrance')
                    ->native(false),

                DatePicker::make('date_expiration')
                    ->label('Date d\'expiration')
                    ->native(false)
                    ->after('date_delivrance'),

                TextInput::make('lieu_delivrance')
                    ->label('Lieu de délivrance')
                    ->maxLength(255),

                TextInput::make('autorite_delivrance')
                    ->label('Autorité de délivrance')
                    ->maxLength(255),

                KeyValue::make('metadata')
                    ->label('Métadonnées')
                    ->keyLabel('Type')
                    ->valueLabel('Valeur')
                    ->disabled()
                    ->dehydrated(false)
                    ->visible(fn ($record) => $record !== null),

                Toggle::make('est_verifie')
                    ->label('Document vérifié')
                    ->required()
                    ->onColor('success')
                    ->offColor('gray'),

                DateTimePicker::make('verifie_le')
                    ->label('Vérifié le')
                    ->native(false)
                    ->visible(fn ($get) => $get('est_verifie')),

                Select::make('verifie_par')
                    ->label('Vérifié par')
                    ->relationship('verifiePar', 'name')
                    ->preload()
                    ->searchable()
                    ->visible(fn ($get) => $get('est_verifie')),
            ]);
    }
}
