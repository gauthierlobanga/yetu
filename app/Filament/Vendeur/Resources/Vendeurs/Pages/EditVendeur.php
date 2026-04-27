<?php

namespace App\Filament\Vendeur\Resources\Vendeurs\Pages;

use App\Filament\Vendeur\Resources\Vendeurs\VendeurResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVendeur extends EditRecord
{
    protected static string $resource = VendeurResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
