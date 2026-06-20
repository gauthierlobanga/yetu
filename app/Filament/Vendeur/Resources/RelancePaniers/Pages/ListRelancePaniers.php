<?php

namespace App\Filament\Vendeur\Resources\RelancePaniers\Pages;

use App\Filament\Vendeur\Resources\RelancePaniers\RelancePanierResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

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
