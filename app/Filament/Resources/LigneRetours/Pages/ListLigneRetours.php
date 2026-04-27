<?php

namespace App\Filament\Resources\LigneRetours\Pages;

use App\Filament\Resources\LigneRetours\LigneRetourResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLigneRetours extends ListRecords
{
    protected static string $resource = LigneRetourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
