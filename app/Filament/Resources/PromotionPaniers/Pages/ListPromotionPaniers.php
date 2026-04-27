<?php

namespace App\Filament\Resources\PromotionPaniers\Pages;

use App\Filament\Resources\PromotionPaniers\PromotionPanierResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPromotionPaniers extends ListRecords
{
    protected static string $resource = PromotionPanierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
