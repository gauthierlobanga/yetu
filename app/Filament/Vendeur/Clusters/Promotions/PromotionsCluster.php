<?php

namespace App\Filament\Vendeur\Clusters\Promotions;

use App\Enums\NavigationGroup;
use Filament\Clusters\Cluster;
use Filament\Pages\Enums\SubNavigationPosition;
use UnitEnum;

class PromotionsCluster extends Cluster
{
    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Shop;

    protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    protected static ?int $navigationSort = 6;
}
