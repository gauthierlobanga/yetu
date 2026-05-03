<?php

namespace App\Filament\Resources\VendorRequests\Pages;

use App\Filament\Resources\VendorRequests\VendorRequestResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVendorRequests extends ListRecords
{
    protected static string $resource = VendorRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
