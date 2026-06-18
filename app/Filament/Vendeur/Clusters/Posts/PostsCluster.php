<?php

namespace App\Filament\Vendeur\Clusters\Posts;

use App\Enums\NavigationGroup;
use Filament\Clusters\Cluster;
use Filament\Pages\Enums\SubNavigationPosition;
use UnitEnum;

class PostsCluster extends Cluster
{
    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Blog;

    protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;
}
