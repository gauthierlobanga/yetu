<?php

namespace App\Filament\Resources\TransactionFidelites\Pages;

use App\Filament\Resources\TransactionFidelites\TransactionFideliteResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTransactionFidelites extends ListRecords
{
    protected static string $resource = TransactionFideliteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
