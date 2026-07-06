<?php

namespace App\Filament\Vendeur\Resources\Notifications\Pages;

use App\Filament\Vendeur\Resources\Notifications\NotificationResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewNotification extends ViewRecord
{
    protected static string $resource = NotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
