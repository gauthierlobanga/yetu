<?php

namespace App\Filament\Vendeur\Resources\DeliveryEvents\Pages;

use App\Filament\Vendeur\Resources\DeliveryEvents\DeliveryEventResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDeliveryEvents extends ListRecords
{
    protected static string $resource = DeliveryEventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
