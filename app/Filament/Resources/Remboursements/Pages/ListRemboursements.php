<?php

namespace App\Filament\Resources\Remboursements\Pages;

use App\Filament\Resources\Remboursements\RemboursementResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRemboursements extends ListRecords
{
    protected static string $resource = RemboursementResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
