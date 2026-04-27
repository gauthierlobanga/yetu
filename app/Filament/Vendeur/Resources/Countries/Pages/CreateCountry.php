<?php

namespace App\Filament\Vendeur\Resources\Countries\Pages;

use App\Filament\Vendeur\Resources\Countries\CountryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCountry extends CreateRecord
{
    protected static string $resource = CountryResource::class;
}
