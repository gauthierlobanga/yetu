<?php

namespace App\Filament\Vendeur\Resources\Notifications\Tables;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class NotificationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('commande.numero_commande')
                    ->label('N° Commande')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->icon('heroicon-o-shopping-bag'),
                TextColumn::make('sujet')
                    ->label('Sujet')
                    ->searchable()
                    ->sortable()
                    ->limit(40)
                    ->weight('bold'),
                TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'email' => 'info',
                        'sms' => 'warning',
                        'push' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'email' => 'Email',
                        'sms' => 'SMS',
                        'push' => 'Push',
                        default => $state,
                    }),
                TextColumn::make('statut')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'en_attente' => 'warning',
                        'envoye' => 'success',
                        'echec' => 'danger',
                        'lu' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'en_attente' => 'En attente',
                        'envoye' => 'Envoyé',
                        'echec' => 'Échoué',
                        'lu' => 'Lu',
                        default => $state,
                    }),
                TextColumn::make('notifiable_type')
                    ->label('Destinataire')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('date_envoi')
                    ->label('Envoyée le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('Non envoyée'),
                TextColumn::make('date_lecture')
                    ->label('Lue le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('Non lue')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Créée le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'email' => 'Email',
                        'sms' => 'SMS',
                        'push' => 'Push',
                    ]),
                SelectFilter::make('statut')
                    ->options([
                        'en_attente' => 'En attente',
                        'envoye' => 'Envoyé',
                        'echec' => 'Échoué',
                        'lu' => 'Lu',
                    ]),
                TrashedFilter::make(),
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')->label('Créée à partir du'),
                        DatePicker::make('created_until')->label('Créée jusqu\'au'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                    BulkAction::make('markAsEnvoye')
                        ->label('Marquer comme envoyé')
                        ->icon('heroicon-o-paper-airplane')
                        ->color('success')
                        ->action(fn (Collection $records) => $records->each(function ($record) {
                            $record->update([
                                'statut' => 'envoye',
                                'date_envoi' => now(),
                            ]);
                        }))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
