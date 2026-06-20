<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Support\Enums\IconSize;
use Filament\Support\Enums\Size;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\PaginationMode;
use Filament\Tables\Table;

class ProductViewsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('product_id')
                    ->label('Produit')
                    ->icon('heroicon-m-shopping-bag')
                    ->iconColor('primary')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(20),

                TextColumn::make('url')
                    ->label('Page du produit')
                    ->icon('heroicon-m-link')
                    ->limit(40)
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

                TextColumn::make('viewed_at')
                    ->label('Consulté le')
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
                //
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
            ->defaultSort('viewed_at', 'desc');
    }
}
