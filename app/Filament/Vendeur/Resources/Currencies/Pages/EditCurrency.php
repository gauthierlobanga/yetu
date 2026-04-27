<?php

namespace App\Filament\Vendeur\Resources\Currencies\Pages;

use App\Filament\Vendeur\Resources\Currencies\CurrencyResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCurrency extends EditRecord
{
    protected static string $resource = CurrencyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
