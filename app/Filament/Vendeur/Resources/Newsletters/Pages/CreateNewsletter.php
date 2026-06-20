<?php

namespace App\Filament\Vendeur\Resources\Newsletters\Pages;

use App\Filament\Vendeur\Resources\Newsletters\NewsletterResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNewsletter extends CreateRecord
{
    protected static string $resource = NewsletterResource::class;
}
