<?php

namespace App\Filament\Vendeur\Resources\NewsletterSends\Pages;

use App\Filament\Vendeur\Resources\NewsletterSends\NewsletterSendResource;
use App\Filament\Vendeur\Resources\NewsletterSends\Widgets\NewsletterSendsStatsWidget;
use App\Models\NewsletterSend;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListNewsletterSends extends ListRecords
{
    protected static string $resource = NewsletterSendResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            NewsletterSendsStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Tous les envois'),
            'opened' => Tab::make('Ouverts')
                ->icon('heroicon-m-envelope-open')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterSend::STATUS_OUVERT)),
            'clicked' => Tab::make('Cliqués')
                ->icon('heroicon-m-cursor-arrow-rays')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterSend::STATUS_CLIQUE))
                ->badge(static::getResource()::getEloquentQuery()->where('status', NewsletterSend::STATUS_CLIQUE)->count()),
            'errors' => Tab::make('Erreurs')
                ->icon('heroicon-m-exclamation-triangle')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterSend::STATUS_ERREUR)),
        ];
    }
}
