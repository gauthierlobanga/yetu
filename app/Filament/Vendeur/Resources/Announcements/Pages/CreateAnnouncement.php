<?php

namespace App\Filament\Vendeur\Resources\Announcements\Pages;

use App\Filament\Vendeur\Resources\Announcements\AnnouncementResource;
use Filament\Facades\Filament;
use Filament\Resources\Pages\CreateRecord;

class CreateAnnouncement extends CreateRecord
{
    protected static string $resource = AnnouncementResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['tenant_id'] = Filament::getTenant()->id;
        $data['target_audience'] = 'buyers';

        return $data;
    }
}
