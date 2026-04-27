<?php

namespace App\Filament\Resources\Devises\Pages;

use App\Filament\Resources\Devises\DeviseResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditDevise extends EditRecord
{
    protected static string $resource = DeviseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
