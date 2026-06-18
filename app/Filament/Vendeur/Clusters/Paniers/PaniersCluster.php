<?php

namespace App\Filament\Vendeur\Clusters\Paniers;

use App\Enums\NavigationGroup;
use Filament\Clusters\Cluster;
use Filament\Pages\Enums\SubNavigationPosition;
use UnitEnum;

class PaniersCluster extends Cluster
{
    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Shop;

    protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    protected static ?int $navigationSort = 3;
}
