<?php

namespace App\Filament\Vendeur\Resources\ProductCategories\Pages;

use App\Filament\Vendeur\Resources\ProductCategories\ProductCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewProductCategory extends ViewRecord
{
    protected static string $resource = ProductCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
