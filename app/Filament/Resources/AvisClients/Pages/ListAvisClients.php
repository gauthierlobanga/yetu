<?php

namespace App\Filament\Resources\AvisClients\Pages;

use App\Filament\Resources\AvisClients\AvisClientResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAvisClients extends ListRecords
{
    protected static string $resource = AvisClientResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
