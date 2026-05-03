<?php

namespace App\Filament\Vendeur\Pages;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Relaticle\Flowforge\Board;
use Relaticle\Flowforge\BoardPage;
use Relaticle\Flowforge\Column;

class PostBoard extends BoardPage
{
    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-view-columns';

    protected static ?string $navigationLabel = 'Post Board';

    protected static ?string $title = 'Post Board';

    public function board(Board $board): Board
    {
        return $board
            ->query($this->getEloquentQuery())
            ->recordTitleAttribute('title')
            ->columnIdentifier('status')
            ->positionIdentifier('position') // Enable drag-and-drop with position field
            ->columns([
                Column::make('title')->label('Titre')->color('gray'),
                Column::make('content')->label('Description')->color('blue'),
                Column::make('status')->label('Statut')->color('green'),
            ]);
    }

    public function getEloquentQuery(): Builder
    {
        return Post::query();
    }
}
