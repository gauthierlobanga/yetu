<?php

namespace App\Filament\Resources\VarianteProduits\Pages;

use App\Filament\Resources\VarianteProduits\VarianteProduitResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditVarianteProduit extends EditRecord
{
    protected static string $resource = VarianteProduitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
