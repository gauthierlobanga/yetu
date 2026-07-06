<?php

namespace App\Filament\Vendeur\Resources\Clients\RelationManagers;

use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class CommandesRelationManager extends RelationManager
{
    protected static string $relationship = 'commandes';

    protected static ?string $recordTitleAttribute = 'numero_commande';

    protected static ?string $title = 'Historique des commandes';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('numero_commande')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('numero_commande')
            ->columns([
                Tables\Columns\TextColumn::make('numero_commande')
                    ->label('N° Commande')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('statut')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'en_attente' => 'warning',
                        'en_cours_de_traitement' => 'info',
                        'expediee' => 'success',
                        'livree' => 'success',
                        'annulee' => 'danger',
                        'remboursee' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('total_paye')
                    ->label('Total payé')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                // Usually we don't create an order from here directly, but we can leave it empty
            ])
            ->recordActions([
                Action::make('view')
                    ->label('Voir')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => route('filament.vendeur.commandes.resources.commandes.view', $record)),
            ])
            ->toolbarActions([
                //
            ])
            ->defaultSort('created_at', 'desc');
    }
}
