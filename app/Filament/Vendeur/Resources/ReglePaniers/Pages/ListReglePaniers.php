<?php

namespace App\Filament\Vendeur\Resources\ReglePaniers\Pages;

use App\Filament\Vendeur\Resources\ReglePaniers\ReglePanierResource;
use App\Filament\Vendeur\Resources\ReglePaniers\Widgets\ReglePaniersStatsWidget;
use App\Models\ReglePanier;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

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
            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('created_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('created_at', Carbon::today())->count()),
            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', Carbon::now()->subDays(7))),
            'this_week' => Tab::make('Cette semaine')
                ->badge(ReglePanier::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // ReglePaniers du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(ReglePanier::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // ReglePaniers des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(ReglePanier::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

            'appliquees' => Tab::make('Appliquées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('appliquee', true)),
            'non_appliquees' => Tab::make('Non appliquées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('appliquee', false)),
            'codes_promo' => Tab::make('Codes promo')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'code_promo')),
        ];
    }
}
