<?php

namespace App\Filament\Resources\Visits\Pages;

use App\Filament\Resources\Visits\VisitResource;
use App\Filament\Resources\Visits\Widgets\VisitsStatsWidget;
use App\Models\Visit;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListVisits extends ListRecords
{
    protected static string $resource = VisitResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            VisitsStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Toutes les visites'),
            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('visited_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('visited_at', Carbon::today())->count()),
            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('visited_at', '>=', Carbon::now()->subDays(7))),
            'this_week' => Tab::make('Cette semaine')
                ->badge(Visit::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // Visits du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(Visit::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // Visits des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(Visit::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

            'desktop' => Tab::make('Desktop')
                ->icon('heroicon-m-computer-desktop')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('device', 'desktop')),
            'mobile' => Tab::make('Mobile')
                ->icon('heroicon-m-device-phone-mobile')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('device', 'mobile')),

        ];
    }
}
