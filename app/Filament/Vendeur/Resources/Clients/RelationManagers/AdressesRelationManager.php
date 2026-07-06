<?php

namespace App\Filament\Vendeur\Resources\Clients\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AdressesRelationManager extends RelationManager
{
    protected static string $relationship = 'adresses';

    protected static ?string $recordTitleAttribute = 'nom_adresse';

    protected static ?string $title = 'Carnet d\'adresses';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('nom_adresse')
                    ->label('Nom de l\'adresse (ex: Domicile)')
                    ->required()
                    ->maxLength(255),
                TextInput::make('prenom')
                    ->label('Prénom')
                    ->required()
                    ->maxLength(255),
                TextInput::make('nom')
                    ->label('Nom')
                    ->required()
                    ->maxLength(255),
                TextInput::make('telephone')
                    ->label('Téléphone')
                    ->tel()
                    ->maxLength(255),
                TextInput::make('rue')
                    ->label('Rue / Adresse')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('complement')
                    ->label('Complément d\'adresse')
                    ->columnSpanFull(),
                TextInput::make('code_postal')
                    ->label('Code Postal')
                    ->required()
                    ->maxLength(255),
                TextInput::make('ville')
                    ->label('Ville')
                    ->required()
                    ->maxLength(255),
                TextInput::make('pays')
                    ->label('Pays')
                    ->required()
                    ->maxLength(255)
                    ->default('France'),
                Toggle::make('is_default_billing')
                    ->label('Adresse de facturation par défaut'),
                Toggle::make('is_default_shipping')
                    ->label('Adresse de livraison par défaut'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('nom_adresse')
            ->columns([
                TextColumn::make('nom_adresse')
                    ->label('Nom')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('rue')
                    ->label('Adresse')
                    ->searchable()
                    ->limit(30),
                TextColumn::make('ville')
                    ->label('Ville')
                    ->searchable(),
                TextColumn::make('code_postal')
                    ->label('CP')
                    ->searchable(),
                TextColumn::make('pays')
                    ->label('Pays')
                    ->searchable(),
                IconColumn::make('is_default_shipping')
                    ->label('Livraison déf.')
                    ->boolean(),
                IconColumn::make('is_default_billing')
                    ->label('Facturation déf.')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
