<?php

namespace App\Filament\Vendeur\Resources\Commandes\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LignesRelationManager extends RelationManager
{
    protected static string $relationship = 'lignes';

    protected static ?string $recordTitleAttribute = 'numero_ligne';

    protected static ?string $title = 'Articles de la commande';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Select::make('produit_id')
                    ->relationship('produit', 'nom')
                    ->required()
                    ->searchable()
                    ->preload(),
                TextInput::make('quantite')
                    ->label('Quantité')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('prix_unitaire')
                    ->label('Prix unitaire')
                    ->required()
                    ->numeric()
                    ->prefix('€'),
                TextInput::make('taxe')
                    ->label('Taxes')
                    ->numeric()
                    ->prefix('€'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('numero_ligne')
            ->columns([
                TextColumn::make('produit.nom')
                    ->label('Produit')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('quantite')
                    ->label('Quantité')
                    ->alignCenter(),
                TextColumn::make('prix_unitaire')
                    ->label('Prix Unitaire')
                    ->money('EUR')
                    ->alignEnd(),
                TextColumn::make('taxe')
                    ->label('Taxes')
                    ->money('EUR')
                    ->alignEnd(),
                TextColumn::make('prix_total')
                    ->label('Total')
                    ->money('EUR')
                    ->weight('bold')
                    ->alignEnd(),
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
