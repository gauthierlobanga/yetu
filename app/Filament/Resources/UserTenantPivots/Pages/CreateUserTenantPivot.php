<?php

namespace App\Filament\Resources\UserTenantPivots\Pages;

use App\Filament\Resources\UserTenantPivots\UserTenantPivotResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserTenantPivot extends CreateRecord
{
    protected static string $resource = UserTenantPivotResource::class;
}
