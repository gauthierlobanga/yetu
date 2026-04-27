<?php

namespace App\Filament\Resources\LigneRetours\Pages;

use App\Filament\Resources\LigneRetours\LigneRetourResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditLigneRetour extends EditRecord
{
    protected static string $resource = LigneRetourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
