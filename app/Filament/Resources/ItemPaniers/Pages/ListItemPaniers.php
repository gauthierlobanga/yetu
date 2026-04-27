<?php

namespace App\Filament\Resources\ItemPaniers\Pages;

use App\Filament\Resources\ItemPaniers\ItemPanierResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListItemPaniers extends ListRecords
{
    protected static string $resource = ItemPanierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
