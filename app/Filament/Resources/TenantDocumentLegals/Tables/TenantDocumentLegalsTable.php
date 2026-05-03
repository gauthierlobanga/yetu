<?php

namespace App\Filament\Resources\TenantDocumentLegals\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;

class TenantDocumentLegalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('tenant.raison_sociale')
                    ->label('Boutique')
                    ->searchable()
                    ->sortable()
                    ->description(fn($record) => $record->tenant?->slug),
                TextColumn::make('vendorRequest.shop_name')
                    ->label('Demande d\'origine')
                    ->placeholder('—')
                    ->toggleable()
                    ->tooltip(fn($record) => $record->vendorRequest?->shop_slug),
                TextColumn::make('typeDocument.nom')
                    ->label('Type de document')
                    ->searchable()
                    ->sortable()
                    ->description(fn($record) => $record->typeDocument?->code),

                TextColumn::make('numero_document')
                    ->label('N° Document')
                    ->searchable()
                    ->placeholder('Non renseigné'),

                TextColumn::make('date_delivrance')
                    ->label('Délivrance')
                    ->date('d/m/Y')
                    ->sortable(),

                TextColumn::make('date_expiration')
                    ->label('Expiration')
                    ->date('d/m/Y')
                    ->sortable()
                    ->color(fn($record) => $record->date_expiration && $record->date_expiration->isPast() ? 'danger' : null)
                    ->icon(fn($record) => $record->date_expiration && $record->date_expiration->isPast() ? 'heroicon-o-exclamation-triangle' : null),

                TextColumn::make('lieu_delivrance')
                    ->label('Lieu')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('autorite_delivrance')
                    ->label('Autorité')
                    ->searchable()
                    ->toggleable(),

                IconColumn::make('est_verifie')
                    ->label('Vérifié')
                    ->boolean(),

                TextColumn::make('verifiePar.name')
                    ->label('Vérifié par')
                    ->placeholder('—')
                    ->toggleable(),

                TextColumn::make('verifie_le')
                    ->label('Vérifié le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Modifié le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('deleted_at')
                    ->label('Supprimé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('est_verifie')
                    ->label('Vérifié'),

                SelectFilter::make('type_document_id')
                    ->label('Type de document')
                    ->relationship('typeDocument', 'nom')
                    ->preload()
                    ->searchable(),

                SelectFilter::make('tenant_id')
                    ->label('Boutique')
                    ->relationship('tenant', 'raison_sociale')
                    ->preload()
                    ->searchable(),

                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
