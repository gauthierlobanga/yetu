<?php

namespace App\Filament\Resources\VisitorEvents\Widgets;

use App\Models\VisitorEvent;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class VisitorEventsStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $todayEvents = VisitorEvent::whereDate('occurred_at', Carbon::today())->count();
        $totalPurchases = VisitorEvent::where('event_type', 'purchase')->count();
        $totalAddCart = VisitorEvent::where('event_type', 'add_to_cart')->count();

        return [
            Stat::make('Événements aujourd\'hui', number_format($todayEvents))
                ->icon('heroicon-o-bolt')
                ->color('primary'),
            Stat::make('Achats (Total)', number_format($totalPurchases))
                ->icon('heroicon-o-shopping-bag')
                ->color('success'),
            Stat::make('Mises au panier (Total)', number_format($totalAddCart))
                ->icon('heroicon-o-shopping-cart')
                ->color('warning'),
        ];
    }
}
