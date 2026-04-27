<?php

use App\Providers\AppServiceProvider;
use App\Providers\CommentServiceProvider;
use App\Providers\Filament\AdminPanelProvider;
use App\Providers\Filament\VendeurPanelProvider;
use App\Providers\FortifyServiceProvider;
use App\Providers\TenancyServiceProvider;

return [
    AppServiceProvider::class,
    TenancyServiceProvider::class,
    AdminPanelProvider::class,
    VendeurPanelProvider::class,
    FortifyServiceProvider::class,
    CommentServiceProvider::class,
];
