<?php

namespace App\Filament\Vendeur\Resources\VisitorEvents\Pages;

use App\Filament\Vendeur\Resources\VisitorEvents\VisitorEventResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVisitorEvent extends EditRecord
{
    protected static string $resource = VisitorEventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
