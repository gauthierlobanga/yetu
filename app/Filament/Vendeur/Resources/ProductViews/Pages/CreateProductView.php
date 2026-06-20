<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Pages;

use App\Filament\Vendeur\Resources\ProductViews\ProductViewResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProductView extends CreateRecord
{
    protected static string $resource = ProductViewResource::class;
}
