<?php

namespace App\Filament\Vendeur\Resources\VisitorEvents\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Support\Enums\IconSize;
use Filament\Support\Enums\Size;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\PaginationMode;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class VisitorEventsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('event_type')
                    ->label("Type d'événement")
                    ->icon('heroicon-m-bolt')
                    ->iconColor('warning')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'page_view' => 'info',
                        'add_to_cart' => 'warning',
                        'purchase' => 'success',
                        'click' => 'primary',
                        'scroll' => 'gray',
                        default => 'gray',
                    }),

                TextColumn::make('url')
                    ->label('Page')
                    ->icon('heroicon-m-globe-alt')
                    ->limit(35)
                    ->searchable()
                    ->tooltip(fn ($record) => $record->url),

                TextColumn::make('visitor_id')
                    ->label('Visiteur')
                    ->icon('heroicon-m-user')
                    ->limit(12)
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('session_id')
                    ->label('Session')
                    ->limit(12)
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('product_id')
                    ->label('Produit')
                    ->icon('heroicon-m-shopping-bag')
                    ->placeholder('—')
                    ->toggleable(),

                TextColumn::make('order_id')
                    ->label('Commande')
                    ->icon('heroicon-m-clipboard-document-list')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('value')
                    ->label('Valeur')
                    ->numeric(decimalPlaces: 2)
                    ->sortable()
                    ->alignEnd()
                    ->placeholder('—'),

                TextColumn::make('occurred_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->icon('heroicon-m-clock'),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('event_type')
                    ->label("Type d'événement")
                    ->options([
                        'page_view' => 'Vue de page',
                        'add_to_cart' => 'Ajout au panier',
                        'purchase' => 'Achat',
                        'click' => 'Clic',
                        'scroll' => 'Scroll',
                    ]),
            ])
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make()
                        ->iconSize(IconSize::Medium)
                        ->color('gray'),
                ])->badge()
                    ->size(Size::Medium)
                    ->label(''),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->paginationMode(PaginationMode::Cursor)
            ->defaultSort('occurred_at', 'desc');
    }
}
