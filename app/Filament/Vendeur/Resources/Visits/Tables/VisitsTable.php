<?php

namespace App\Filament\Vendeur\Resources\Visits\Tables;

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

class VisitsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('url')
                    ->label('Page visitée')
                    ->icon('heroicon-m-globe-alt')
                    ->iconColor('primary')
                    ->limit(40)
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn ($record) => $record->path)
                    ->tooltip(fn ($record) => $record->url),

                TextColumn::make('method')
                    ->label('Méthode')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'GET' => 'success',
                        'POST' => 'warning',
                        'PUT', 'PATCH' => 'info',
                        'DELETE' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('ip')
                    ->label('Adresse IP')
                    ->icon('heroicon-m-signal')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('device')
                    ->label('Appareil')
                    ->icon('heroicon-m-device-phone-mobile')
                    ->badge()
                    ->color('gray')
                    ->searchable(),

                TextColumn::make('browser')
                    ->label('Navigateur')
                    ->icon('heroicon-m-window')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('platform')
                    ->label('Plateforme')
                    ->icon('heroicon-m-computer-desktop')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('referrer')
                    ->label('Référent')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->limit(30)
                    ->placeholder('Direct')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('duration')
                    ->label('Durée')
                    ->numeric()
                    ->suffix(' s')
                    ->sortable()
                    ->alignCenter()
                    ->badge()
                    ->color(fn ($state): string => match (true) {
                        $state > 120 => 'success',
                        $state > 30 => 'warning',
                        default => 'danger',
                    }),

                TextColumn::make('language')
                    ->label('Langue')
                    ->badge()
                    ->color('info')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('visited_at')
                    ->label('Date de visite')
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
                SelectFilter::make('method')
                    ->label('Méthode HTTP')
                    ->options([
                        'GET' => 'GET',
                        'POST' => 'POST',
                        'PUT' => 'PUT',
                        'PATCH' => 'PATCH',
                        'DELETE' => 'DELETE',
                    ]),

                SelectFilter::make('device')
                    ->label('Appareil')
                    ->options([
                        'desktop' => 'Desktop',
                        'mobile' => 'Mobile',
                        'tablet' => 'Tablette',
                    ]),

                SelectFilter::make('browser')
                    ->label('Navigateur')
                    ->options([
                        'Chrome' => 'Chrome',
                        'Firefox' => 'Firefox',
                        'Safari' => 'Safari',
                        'Edge' => 'Edge',
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
            ->defaultSort('visited_at', 'desc');
    }
}
