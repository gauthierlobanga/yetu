<?php

namespace App\Filament\Vendeur\Resources\DeliveryTrackings\Pages;

use App\Filament\Vendeur\Resources\DeliveryTrackings\DeliveryTrackingResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditDeliveryTracking extends EditRecord
{
    protected static string $resource = DeliveryTrackingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
