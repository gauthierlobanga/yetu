<?php

namespace App\Filament\Resources\Paniers\Pages;

use App\Filament\Resources\Paniers\PanierResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPaniers extends ListRecords
{
    protected static string $resource = PanierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
