<?php

namespace App\Filament\Vendeur\Resources\ProductViews\Widgets;

use App\Models\ProductView;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class ProductViewsStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $today = ProductView::whereDate('viewed_at', Carbon::today())->count();
        $yesterday = ProductView::whereDate('viewed_at', Carbon::yesterday())->count();

        $trend = $yesterday > 0 ? (($today - $yesterday) / $yesterday) * 100 : ($today > 0 ? 100 : 0);
        $trendIcon = $trend > 0 ? 'heroicon-m-arrow-trending-up' : ($trend < 0 ? 'heroicon-m-arrow-trending-down' : 'heroicon-m-minus');
        $trendColor = $trend > 0 ? 'success' : ($trend < 0 ? 'danger' : 'gray');

        $distinctProducts = ProductView::where('viewed_at', '>=', Carbon::now()->subDays(30))->distinct('product_id')->count('product_id');

        return [
            Stat::make('Vues aujourd\'hui', number_format($today))
                ->description(abs(round($trend, 1)).'% par rapport à hier')
                ->descriptionIcon($trendIcon)
                ->color($trendColor),
            Stat::make('Vues (7 derniers jours)', number_format(ProductView::where('viewed_at', '>=', Carbon::now()->subDays(7))->count()))
                ->icon('heroicon-o-chart-bar'),
            Stat::make('Produits distincts vus (30j)', number_format($distinctProducts))
                ->icon('heroicon-o-shopping-bag'),
        ];
    }
}
