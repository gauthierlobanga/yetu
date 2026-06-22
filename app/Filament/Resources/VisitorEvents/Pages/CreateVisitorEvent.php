<?php

namespace App\Filament\Resources\VisitorEvents\Pages;

use App\Filament\Resources\VisitorEvents\VisitorEventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateVisitorEvent extends CreateRecord
{
    protected static string $resource = VisitorEventResource::class;
}
