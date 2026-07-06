<?php

namespace App\Filament\Vendeur\Resources\Commandes\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaiementsRelationManager extends RelationManager
{
    protected static string $relationship = 'paiements';

    protected static ?string $recordTitleAttribute = 'reference_transaction';

    protected static ?string $title = 'Paiements';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('reference_transaction')
                    ->label('Référence de la transaction')
                    ->required()
                    ->maxLength(255),
                TextInput::make('montant')
                    ->label('Montant')
                    ->required()
                    ->numeric()
                    ->prefix('€'),
                Select::make('methode_paiement')
                    ->label('Méthode de paiement')
                    ->options([
                        'carte' => 'Carte Bancaire',
                        'paypal' => 'PayPal',
                        'virement' => 'Virement',
                        'especes' => 'Espèces',
                        'wallet' => 'Portefeuille',
                    ])
                    ->required(),
                Select::make('statut')
                    ->label('Statut')
                    ->options([
                        'en_attente' => 'En attente',
                        'complete' => 'Complété',
                        'echoue' => 'Échoué',
                        'rembourse' => 'Remboursé',
                    ])
                    ->required(),
                DateTimePicker::make('date_paiement')
                    ->label('Date de paiement')
                    ->default(now()),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('reference_transaction')
            ->columns([
                TextColumn::make('reference_transaction')
                    ->label('Référence')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('methode_paiement')
                    ->label('Méthode')
                    ->badge(),
                TextColumn::make('montant')
                    ->label('Montant')
                    ->money('EUR')
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('statut')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'en_attente' => 'warning',
                        'complete' => 'success',
                        'echoue' => 'danger',
                        'rembourse' => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('date_paiement')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
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
            ])
            ->defaultSort('created_at', 'desc');
    }
}
