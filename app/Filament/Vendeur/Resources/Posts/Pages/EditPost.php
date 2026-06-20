<?php

namespace App\Filament\Vendeur\Resources\Posts\Pages;

use App\Filament\Vendeur\Resources\Posts\PostResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class EditPost extends EditRecord
{
    protected static string $resource = PostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function getCreatedNotification(): ?Notification
    {
        $post = $this->record;

        return Notification::make()
            ->title('Saved successfully')
            ->success()
            ->body('Changes to the post have been saved.')
            ->actions([
                Action::make('view')
                    ->button()
                    ->url(route('tenant.blog.show', $post), shouldOpenInNewTab: true),
                Action::make('undo')
                    ->color('gray')
                    ->dispatch('undoEditingPost', [$post->id])
                    ->close(),
            ])
            ->broadcast(Auth::user());
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with('categories');
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Forcer la structure Tiptap sur les champs sensibles
        if (empty($data['content'])) {
            $data['content'] = '{"type":"doc","content":[]}';
        }
        if (empty($data['excerpt'])) {
            $data['excerpt'] = '{"type":"doc","content":[]}';
        }

        return $data;
    }
}
