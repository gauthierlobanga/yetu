<?php

namespace App\Filament\Vendeur\Resources\DeliveryEvents\Pages;

use App\Filament\Vendeur\Resources\DeliveryEvents\DeliveryEventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDeliveryEvent extends CreateRecord
{
    protected static string $resource = DeliveryEventResource::class;
}
