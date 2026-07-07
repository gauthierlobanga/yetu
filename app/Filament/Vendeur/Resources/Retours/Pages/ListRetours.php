<?php

namespace App\Filament\Vendeur\Resources\Retours\Pages;

use App\Filament\Vendeur\Resources\Retours\RetourResource;
use App\Models\Retour;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListRetours extends ListRecords
{
    protected static string $resource = RetourResource::class;

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
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('created_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('created_at', Carbon::today())->count()),
            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', Carbon::now()->subDays(7))),
            'this_week' => Tab::make('Cette semaine')
                ->badge(Retour::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // Retours du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(Retour::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // Retours des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(Retour::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

            'en_attente' => Tab::make('En attente')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'en_attente')),
            'approuve' => Tab::make('Approuvés')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'approuve')),
            'recu' => Tab::make('Reçus')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'recu')),
            'rembourse' => Tab::make('Remboursés')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'rembourse')),
            'refuse' => Tab::make('Refusés')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'refuse')),
        ];
    }
}
