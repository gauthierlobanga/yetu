<?php

namespace App\Filament\Resources\LigneCommandes\Pages;

use App\Filament\Resources\LigneCommandes\LigneCommandeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLigneCommandes extends ListRecords
{
    protected static string $resource = LigneCommandeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
