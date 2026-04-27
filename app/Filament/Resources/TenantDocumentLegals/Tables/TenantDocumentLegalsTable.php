<?php

namespace App\Filament\Resources\TenantDocumentLegals\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TenantDocumentLegalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('tenant.raison_sociale')
                    ->searchable(),
                TextColumn::make('typeDocument.code')
                    ->searchable(),
                TextColumn::make('numero_document')
                    ->searchable(),
                TextColumn::make('date_delivrance')
                    ->date()
                    ->sortable(),

                TextColumn::make('lieu_delivrance')
                    ->searchable(),
                TextColumn::make('autorite_delivrance')
                    ->searchable(),
                IconColumn::make('est_verifie')
                    ->boolean(),
                TextColumn::make('verifie_le')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('verifiePar.name'),
                TextColumn::make('date_expiration')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
