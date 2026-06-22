<?php

namespace App\Filament\Resources\VisitorEvents\Pages;

use App\Filament\Resources\VisitorEvents\VisitorEventResource;
use App\Filament\Resources\VisitorEvents\Widgets\VisitorEventsStatsWidget;
use App\Models\VisitorEvent;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
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
            'this_week' => Tab::make('Cette semaine')
                ->badge(VisitorEvent::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // VisitorEvents du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(VisitorEvent::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // VisitorEvents des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(VisitorEvent::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

        ];
    }
}
