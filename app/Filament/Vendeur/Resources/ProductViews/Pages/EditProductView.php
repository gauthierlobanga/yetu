<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Pages;

use App\Filament\Vendeur\Resources\ProductViews\ProductViewResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProductView extends EditRecord
{
    protected static string $resource = ProductViewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
