<?php

namespace App\Filament\Vendeur\Resources\Remboursements\Pages;

use App\Filament\Vendeur\Resources\Remboursements\RemboursementResource;
use App\Models\Remboursement;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListRemboursements extends ListRecords
{
    protected static string $resource = RemboursementResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Tous'),
            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('visited_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('visited_at', Carbon::today())->count()),
            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('visited_at', '>=', Carbon::now()->subDays(7))),
            'this_week' => Tab::make('Cette semaine')
                ->badge(Remboursement::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // Remboursements du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(Remboursement::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // Remboursements des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(Remboursement::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

            'en_attente' => Tab::make('En attente')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'en_attente')),
            'traite' => Tab::make('Traités')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'traite')),
            'echoue' => Tab::make('Échoués')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'echoue')),
        ];
    }
}
