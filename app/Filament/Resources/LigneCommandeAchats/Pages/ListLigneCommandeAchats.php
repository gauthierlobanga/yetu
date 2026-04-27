<?php

namespace App\Filament\Resources\LigneCommandeAchats\Pages;

use App\Filament\Resources\LigneCommandeAchats\LigneCommandeAchatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLigneCommandeAchats extends ListRecords
{
    protected static string $resource = LigneCommandeAchatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
