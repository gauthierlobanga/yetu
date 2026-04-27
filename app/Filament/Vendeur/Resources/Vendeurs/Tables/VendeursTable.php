<?php

namespace App\Filament\Vendeur\Resources\Vendeurs\Tables;

use App\Models\Tenant;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class VendeursTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('tenant_avatar')
                    ->label('Avatar')
                    ->circular()
                    ->collection('tenant_avatar')
                    ->defaultImageUrl(fn ($record) => $record->avatar_url),
                TextColumn::make('raison_sociale')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->label('Actif')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('members')
                    ->visible(fn (): bool => Auth::user()->hasRole('super_admin'))
                    ->icon(Heroicon::OutlinedPlusCircle)
                    ->schema(function () {
                        return [
                            Select::make('selectedUsers')
                                ->options(User::pluck('name', 'id')->toArray())
                                ->multiple()
                                ->preload()
                                ->searchable(),
                        ];
                    })->action(function (Tenant $record, array $data) {
                        $selectedUsers = $data['selectedUsers'];
                        $record->users()->syncWithoutDetaching($selectedUsers);
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
