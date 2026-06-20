<?php

namespace App\Filament\Vendeur\Resources\ReglePaniers\Widgets;

use App\Models\ReglePanier;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ReglePaniersStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRules = ReglePanier::count();
        $appliedRules = ReglePanier::where('appliquee', true)->count();
        $totalDiscount = ReglePanier::where('appliquee', true)->get()->sum('montant_reduction');

        return [
            Stat::make('Règles créées', number_format($totalRules))
                ->icon('heroicon-o-document-duplicate')
                ->color('primary'),
            Stat::make('Règles appliquées', number_format($appliedRules))
                ->icon('heroicon-o-check-badge')
                ->color('success'),
            Stat::make('Total réductions accordées', number_format($totalDiscount, 2) . ' €')
                ->icon('heroicon-o-banknotes')
                ->color('warning'),
        ];
    }
}
