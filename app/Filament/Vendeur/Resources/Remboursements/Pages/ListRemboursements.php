<?php

namespace App\Filament\Vendeur\Resources\Remboursements\Pages;

use App\Filament\Vendeur\Resources\Remboursements\RemboursementResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

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
            'en_attente' => Tab::make('En attente')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'en_attente')),
            'traite' => Tab::make('Traités')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'traite')),
            'echoue' => Tab::make('Échoués')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('statut', 'echoue')),
        ];
    }
}
