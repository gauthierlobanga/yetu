<?php

namespace App\Filament\Resources\UserTenantPivots\Pages;

use App\Filament\Resources\UserTenantPivots\UserTenantPivotResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserTenantPivot extends EditRecord
{
    protected static string $resource = UserTenantPivotResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
