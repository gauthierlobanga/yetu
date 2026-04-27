<?php

namespace App\Filament\Resources\CommandeAchats\Pages;

use App\Filament\Resources\CommandeAchats\CommandeAchatResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditCommandeAchat extends EditRecord
{
    protected static string $resource = CommandeAchatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
