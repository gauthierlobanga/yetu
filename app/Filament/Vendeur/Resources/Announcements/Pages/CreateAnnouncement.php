<?php

namespace App\Filament\Vendeur\Resources\Announcements\Pages;

use App\Filament\Vendeur\Resources\Announcements\AnnouncementResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAnnouncement extends CreateRecord
{
    protected static string $resource = AnnouncementResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['tenant_id'] = tenant()->id;
        $data['target_audience'] = 'buyers';

        return $data;
    }
}
