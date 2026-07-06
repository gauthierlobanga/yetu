<?php

namespace App\Filament\Vendeur\Resources\ProductCategories\RelationManagers;

use App\Filament\Vendeur\Resources\Produits\Schemas\ProduitForm;
use App\Filament\Vendeur\Resources\Produits\Tables\ProduitsTable;
use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class ProduitsRelationManager extends RelationManager
{
    protected static string $relationship = 'products';

    protected static ?string $recordTitleAttribute = 'nom';

    protected static ?string $title = 'Produits de la catégorie';

    public function form(Schema $schema): Schema
    {
        return ProduitForm::configure($schema);
    }

    public function table(Table $table): Table
    {
        return ProduitsTable::configure($table)
            ->headerActions([
                CreateAction::make(),
                AttachAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DetachAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                ]),
            ])
            ->modifyQueryUsing(fn ($query) => $query); 
    }
}
