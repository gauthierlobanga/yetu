<?php

namespace App\Filament\Resources\UserTenantPivots\Pages;

use App\Filament\Resources\UserTenantPivots\UserTenantPivotResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserTenantPivots extends ListRecords
{
    protected static string $resource = UserTenantPivotResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
