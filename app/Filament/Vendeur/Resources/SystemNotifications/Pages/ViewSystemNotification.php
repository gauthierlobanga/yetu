<?php

namespace App\Filament\Vendeur\Resources\SystemNotifications\Pages;

use App\Filament\Vendeur\Resources\SystemNotifications\SystemNotificationResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewSystemNotification extends ViewRecord
{
    protected static string $resource = SystemNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
