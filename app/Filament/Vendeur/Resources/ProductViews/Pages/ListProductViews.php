<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Pages;

use App\Filament\Vendeur\Resources\ProductViews\ProductViewResource;
use App\Filament\Vendeur\Resources\ProductViews\Widgets\ProductViewsStatsWidget;
use App\Models\ProductView;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListProductViews extends ListRecords
{
    protected static string $resource = ProductViewResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ProductViewsStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Toutes les vues'),
            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('viewed_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('viewed_at', Carbon::today())->count()),
            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('viewed_at', '>=', Carbon::now()->subDays(7))),
            'last_30_days' => Tab::make('30 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('viewed_at', '>=', Carbon::now()->subDays(30))),
            'this_week' => Tab::make('Cette semaine')
                ->badge(ProductView::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // ProductViews du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(ProductView::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // ProductViews des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(ProductView::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

        ];
    }
}
