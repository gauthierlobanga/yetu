<?php

namespace App\Filament\Resources\SystemNotifications\Tables;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SystemNotificationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('type')
                    ->label('Type')
                    ->searchable()
                    ->sortable()
                    ->formatStateUsing(fn (string $state): string => class_basename($state)),
                TextColumn::make('data')
                    ->label('Données')
                    ->limit(50)
                    ->tooltip(fn ($state) => is_array($state) ? json_encode($state) : $state)
                    ->wrap(),
                TextColumn::make('notifiable_type')
                    ->label('Destinataire')
                    ->searchable()
                    ->formatStateUsing(fn (string $state): string => class_basename($state)),
                TextColumn::make('notifiable_id')
                    ->label('ID Destinataire')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('read_at')
                    ->label('Lu le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('Non lu')
                    ->icon(fn ($state) => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                    ->color(fn ($state) => $state ? 'success' : 'warning'),
                TextColumn::make('created_at')
                    ->label('Créée le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('Modifiée le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('read_at')
                    ->label('Statut de lecture')
                    ->nullable()
                    ->placeholder('Toutes')
                    ->trueLabel('Lues')
                    ->falseLabel('Non lues')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('read_at'),
                        false: fn (Builder $query) => $query->whereNull('read_at'),
                        blank: fn (Builder $query) => $query,
                    ),
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
                    BulkAction::make('markAsRead')
                        ->label('Marquer comme lu')
                        ->icon('heroicon-o-check')
                        ->color('success')
                        ->action(fn (Collection $records) => $records->each->markAsRead())
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
