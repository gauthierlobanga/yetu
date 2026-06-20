<?php

namespace App\Filament\Vendeur\Resources\RelancePaniers\Pages;

use App\Filament\Vendeur\Resources\RelancePaniers\RelancePanierResource;
use App\Models\RelancePanier;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ListRelancePaniers extends ListRecords
{
    protected static string $resource = RelancePanierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Toutes'),

            'today' => Tab::make('Aujourd\'hui')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('visited_at', Carbon::today()))
                ->badge(static::getResource()::getEloquentQuery()->whereDate('visited_at', Carbon::today())->count()),

            'last_7_days' => Tab::make('7 derniers jours')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('visited_at', '>=', Carbon::now()->subDays(7))),

            'this_week' => Tab::make('Cette semaine')
                ->badge(RelancePanier::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),

            // RelancePaniers du mois dernier
            'last_month' => Tab::make('Mois dernier')
                ->badge(RelancePanier::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar-days')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])),

            // RelancePaniers des 30 derniers jours
            'last_30_days' => Tab::make('30 derniers jours')
                ->badge(RelancePanier::where('created_at', '>=', now()->subDays(30))->count())
                ->badgeColor('info')
                ->icon('heroicon-m-calendar')
                ->iconPosition(IconPosition::Before)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),

            'en_attente' => Tab::make('En attente')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'en_attente')),
            'envoyees' => Tab::make('Envoyées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'envoye')),
            'ouvertes' => Tab::make('Ouvertes')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'ouvert')),
            'cliquees' => Tab::make('Cliquées')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'clique')),
            'converties' => Tab::make('Converties')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('a_conduit_achat', true)),
        ];
    }
}
