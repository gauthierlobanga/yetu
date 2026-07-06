<?php

namespace App\Filament\Vendeur\Resources\Produits\Pages;

use App\Filament\Vendeur\Resources\Produits\ProduitResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewProduit extends ViewRecord
{
    protected static string $resource = ProduitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
