<?php

namespace App\Filament\Vendeur\Resources\Retours\Pages;

use App\Filament\Vendeur\Resources\Retours\RetourResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

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
