<?php

namespace App\Filament\Vendeur\Resources\CookieConsents\Pages;

use App\Filament\Vendeur\Resources\CookieConsents\CookieConsentResource;
use Filament\Resources\Pages\ManageRecords;

class ManageCookieConsents extends ManageRecords
{
    protected static string $resource = CookieConsentResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
