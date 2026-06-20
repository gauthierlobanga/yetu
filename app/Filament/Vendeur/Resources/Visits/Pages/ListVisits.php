<?php

namespace App\Filament\Vendeur\Resources\Visits\Pages;

use App\Filament\Vendeur\Resources\Visits\VisitResource;
use App\Filament\Vendeur\Resources\Visits\Widgets\VisitsStatsWidget;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
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
            'desktop' => Tab::make('Desktop')
                ->icon('heroicon-m-computer-desktop')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('device', 'desktop')),
            'mobile' => Tab::make('Mobile')
                ->icon('heroicon-m-device-phone-mobile')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('device', 'mobile')),
        ];
    }
}
