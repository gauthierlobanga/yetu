<?php

namespace App\Filament\Resources\SystemNotifications\Pages;

use App\Filament\Resources\SystemNotifications\SystemNotificationResource;
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
