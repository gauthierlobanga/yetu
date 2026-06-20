<?php

namespace App\Filament\Vendeur\Resources\Remboursements\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class RemboursementsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->label('Référence')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->copyable()
                    ->toggleable(),

                TextColumn::make('paiement.reference')
                    ->label('Paiement')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('retour.reference')
                    ->label('Retour')
                    ->searchable()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('montant')
                    ->label('Montant')
                    ->money('EUR')
                    ->sortable()
                    ->alignEnd()
                    ->toggleable(),

                TextColumn::make('mode')
                    ->label('Mode')
                    ->badge()
                    ->color('info')
                    ->toggleable(),

                TextColumn::make('statut')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'en_attente' => 'warning',
                        'valide' => 'success',
                        'echec' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'en_attente' => 'En attente',
                        'valide' => 'Validé',
                        'echec' => 'Échec',
                        default => $state,
                    })
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('motif')
                    ->label('Motif')
                    ->limit(30)
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('date_remboursement')
                    ->label('Remboursé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('statut')
                    ->label('Statut')
                    ->options([
                        'en_attente' => 'En attente',
                        'valide' => 'Validé',
                        'echec' => 'Échec',
                    ])
                    ->multiple(),

                SelectFilter::make('mode')
                    ->label('Mode')
                    ->options([
                        'carte_bancaire' => 'Carte bancaire',
                        'paypal' => 'PayPal',
                        'virement' => 'Virement bancaire',
                        'especes' => 'Espèces',
                        'avoir' => 'Avoir',
                    ])
                    ->multiple(),

                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('valider')
                    ->label('Valider')
                    ->icon('heroicon-m-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->statut === 'en_attente')
                    ->action(function ($record) {
                        $record->valider();
                        Notification::make()
                            ->success()
                            ->title('Remboursement validé')
                            ->send();
                    }),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('Aucun remboursement')
            ->emptyStateIcon('heroicon-o-currency-euro')
            ->poll('60s')
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->persistFiltersInSession();
    }
}
