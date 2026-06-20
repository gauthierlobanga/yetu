<?php

namespace App\Filament\Vendeur\Resources\VisitorEvents\Pages;

use App\Filament\Vendeur\Resources\VisitorEvents\VisitorEventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateVisitorEvent extends CreateRecord
{
    protected static string $resource = VisitorEventResource::class;
}
