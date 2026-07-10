<?php

namespace App\Filament\Vendeur\Resources\DeliveryEvents\Pages;

use App\Filament\Vendeur\Resources\DeliveryEvents\DeliveryEventResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDeliveryEvent extends EditRecord
{
    protected static string $resource = DeliveryEventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
