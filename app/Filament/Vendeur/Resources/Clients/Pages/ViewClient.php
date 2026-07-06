<?php

namespace App\Filament\Vendeur\Resources\Clients\Pages;

use App\Filament\Vendeur\Resources\Clients\ClientResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewClient extends ViewRecord
{
    protected static string $resource = ClientResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
