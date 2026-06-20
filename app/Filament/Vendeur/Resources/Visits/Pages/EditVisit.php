<?php

namespace App\Filament\Vendeur\Resources\Visits\Pages;

use App\Filament\Vendeur\Resources\Visits\VisitResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVisit extends EditRecord
{
    protected static string $resource = VisitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
