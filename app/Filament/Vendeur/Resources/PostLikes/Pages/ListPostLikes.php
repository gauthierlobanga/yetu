<?php

namespace App\Filament\Vendeur\Resources\PostLikes\Pages;

use App\Filament\Vendeur\Resources\PostLikes\PostLikeResource;
use App\Filament\Vendeur\Resources\PostLikes\Widgets\PostLikeStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;


class ListPostLikes extends ListRecords
{
    protected static string $resource = PostLikeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            PostLikeStatsWidget::class,
        ];
    }

}
