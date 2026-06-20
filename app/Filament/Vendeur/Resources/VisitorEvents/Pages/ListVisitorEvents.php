<?php

namespace App\Filament\Vendeur\Resources\VisitorEvents\Pages;

use App\Filament\Vendeur\Resources\VisitorEvents\VisitorEventResource;
use App\Filament\Vendeur\Resources\VisitorEvents\Widgets\VisitorEventsStatsWidget;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListVisitorEvents extends ListRecords
{
    protected static string $resource = VisitorEventResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            VisitorEventsStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Tous les événements'),
            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('occurred_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('occurred_at', Carbon::today())->count()),
            'purchases' => Tab::make('Achats')
                ->icon('heroicon-m-shopping-bag')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('event_type', 'purchase')),
            'add_to_cart' => Tab::make('Ajouts au panier')
                ->icon('heroicon-m-shopping-cart')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('event_type', 'add_to_cart')),
            'page_views' => Tab::make('Vues de page')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('event_type', 'page_view')),
        ];
    }
}
