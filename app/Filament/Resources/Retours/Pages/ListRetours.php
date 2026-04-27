<?php

namespace App\Filament\Resources\Retours\Pages;

use App\Filament\Resources\Retours\RetourResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRetours extends ListRecords
{
    protected static string $resource = RetourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
