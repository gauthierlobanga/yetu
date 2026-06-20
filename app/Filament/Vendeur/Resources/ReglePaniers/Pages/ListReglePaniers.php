<?php

namespace App\Filament\Vendeur\Resources\ReglePaniers\Pages;

use App\Filament\Vendeur\Resources\ReglePaniers\ReglePanierResource;
use App\Filament\Vendeur\Resources\ReglePaniers\Widgets\ReglePaniersStatsWidget;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListReglePaniers extends ListRecords
{
    protected static string $resource = ReglePanierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ReglePaniersStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Toutes'),
            'appliquees' => Tab::make('Appliquées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('appliquee', true)),
            'non_appliquees' => Tab::make('Non appliquées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('appliquee', false)),
            'codes_promo' => Tab::make('Codes promo')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'code_promo')),
        ];
    }
}
