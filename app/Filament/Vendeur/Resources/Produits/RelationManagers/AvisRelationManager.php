<?php

namespace App\Filament\Vendeur\Resources\Produits\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AvisRelationManager extends RelationManager
{
    protected static string $relationship = 'avis';

    protected static ?string $recordTitleAttribute = 'titre';

    protected static ?string $title = 'Avis clients';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('note')
                    ->label('Note')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(5),
                TextInput::make('titre')
                    ->label('Titre')
                    ->required()
                    ->maxLength(255),
                Textarea::make('commentaire')
                    ->label('Commentaire')
                    ->columnSpanFull(),
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->label('Client')
                    ->searchable()
                    ->preload(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('titre')
            ->columns([
                TextColumn::make('user.name')
                    ->label('Client')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('note')
                    ->label('Note')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('titre')
                    ->label('Titre')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime()
                    ->sortable(),
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
