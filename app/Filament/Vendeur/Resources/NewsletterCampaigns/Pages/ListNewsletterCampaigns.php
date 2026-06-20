<?php

namespace App\Filament\Vendeur\Resources\NewsletterCampaigns\Pages;

use App\Filament\Vendeur\Resources\NewsletterCampaigns\NewsletterCampaignResource;
use App\Filament\Vendeur\Resources\NewsletterCampaigns\Widgets\CampaignsStatsWidget;
use App\Models\NewsletterCampaign;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListNewsletterCampaigns extends ListRecords
{
    protected static string $resource = NewsletterCampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            CampaignsStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Toutes'),
            'drafts' => Tab::make('Brouillons')
                ->icon('heroicon-m-pencil')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterCampaign::STATUS_BROUILLON)),
            'scheduled' => Tab::make('Programmées')
                ->icon('heroicon-m-clock')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterCampaign::STATUS_PROGRAMME)),
            'sent' => Tab::make('Envoyées')
                ->icon('heroicon-m-check-circle')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', NewsletterCampaign::STATUS_ENVOYE))
                ->badge(static::getResource()::getEloquentQuery()->where('status', NewsletterCampaign::STATUS_ENVOYE)->count()),
        ];
    }
}
