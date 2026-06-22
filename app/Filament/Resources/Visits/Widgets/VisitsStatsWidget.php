<?php

namespace App\Filament\Resources\Visits\Widgets;

use App\Models\Visit;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class VisitsStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $today = Visit::whereDate('visited_at', Carbon::today())->count();
        $yesterday = Visit::whereDate('visited_at', Carbon::yesterday())->count();

        $trend = $yesterday > 0 ? (($today - $yesterday) / $yesterday) * 100 : ($today > 0 ? 100 : 0);
        $trendIcon = $trend > 0 ? 'heroicon-m-arrow-trending-up' : ($trend < 0 ? 'heroicon-m-arrow-trending-down' : 'heroicon-m-minus');
        $trendColor = $trend > 0 ? 'success' : ($trend < 0 ? 'danger' : 'gray');

        return [
            Stat::make('Visites aujourd\'hui', number_format($today))
                ->description(abs(round($trend, 1)).'% par rapport à hier')
                ->descriptionIcon($trendIcon)
                ->color($trendColor),
            Stat::make('Visites (7 derniers jours)', number_format(Visit::where('visited_at', '>=', Carbon::now()->subDays(7))->count()))
                ->icon('heroicon-o-chart-bar'),
            Stat::make('Total des visites', number_format(Visit::count()))
                ->icon('heroicon-o-globe-alt'),
        ];
    }
}
