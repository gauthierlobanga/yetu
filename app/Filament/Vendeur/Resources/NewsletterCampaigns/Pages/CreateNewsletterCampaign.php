<?php

namespace App\Filament\Vendeur\Resources\NewsletterCampaigns\Pages;

use App\Filament\Vendeur\Resources\NewsletterCampaigns\NewsletterCampaignResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNewsletterCampaign extends CreateRecord
{
    protected static string $resource = NewsletterCampaignResource::class;
}
