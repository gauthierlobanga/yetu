<?php

namespace App\Filament\Resources\ProduitFournisseurs\Pages;

use App\Filament\Resources\ProduitFournisseurs\ProduitFournisseurResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditProduitFournisseur extends EditRecord
{
    protected static string $resource = ProduitFournisseurResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
