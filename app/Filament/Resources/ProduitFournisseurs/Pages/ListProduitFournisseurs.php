<?php

namespace App\Filament\Resources\ProduitFournisseurs\Pages;

use App\Filament\Resources\ProduitFournisseurs\ProduitFournisseurResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListProduitFournisseurs extends ListRecords
{
    protected static string $resource = ProduitFournisseurResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
