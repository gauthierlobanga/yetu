<?php

namespace App\Filament\Vendeur\Resources\SystemNotifications\Pages;

use App\Filament\Vendeur\Resources\SystemNotifications\SystemNotificationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSystemNotifications extends ListRecords
{
    protected static string $resource = SystemNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
