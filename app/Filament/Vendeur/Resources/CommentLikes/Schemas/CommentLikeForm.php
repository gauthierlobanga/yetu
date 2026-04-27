<?php

namespace App\Filament\Vendeur\Resources\CommentLikes\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CommentLikeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informations du like')
                    ->icon('heroicon-o-heart')
                    ->schema([
                        Select::make('tenant_id')
                            ->label('Organisation')
                            ->relationship('tenant', 'raison_sociale')
                            ->preload()
                            ->searchable()
                            ->options(function () {
                                $user = Auth::user();

                                // Si l'utilisateur est Super Admin, il voit toutes les Vendeurs
                                if ($user->hasRole(['super_admin'])) {
                                    return Tenant::pluck('raison_sociale', 'id');
                                }

                                // Sinon, il voit seulement ses Vendeurs
                                return $user->tenants()->pluck('raison_sociale', 'tenants.id');
                            })
                            ->default(function () {
                                $user = Auth::user();

                                // Si on est dans un contexte tenant, pré-remplir avec la Vendeur actuelle
                                if (Filament::hasTenancy() && Filament::getTenant()) {
                                    return Filament::getTenant()->id;
                                }

                                // Si l'utilisateur n'a qu'une seule Vendeur, la sélectionner par défaut
                                if ($user->tenants()->count() === 1) {
                                    return $user->tenants()->first()->id;
                                }

                                return null;
                            })
                            ->required(),
                        Select::make('comment_id')
                            ->relationship(
                                name: 'comment',
                                titleAttribute: 'contenu' // Adaptez selon votre colonne (content/contenu/texte)
                            )
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Commentaire')
                            ->selectablePlaceholder(false)
                            ->getOptionLabelFromRecordUsing(fn ($record) => Str::limit($record->contenu ?? $record->content ?? '', 50)
                            ),

                        Select::make('user_id')
                            ->relationship(
                                name: 'user',
                                titleAttribute: 'name' // Vérifiez si c'est 'name' ou 'nom'
                            )
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Utilisateur')
                            ->selectablePlaceholder(false)
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->name} ({$record->email})"
                            ),

                        Select::make('type')
                            ->options([
                                'like' => '👍 Like',
                                'love' => '❤️ Love',
                                'laugh' => '😄 Haha',
                                'wow' => '😮 Wow',
                                'sad' => '😢 Triste',
                                'angry' => '😠 En colère',
                            ])
                            ->required()
                            ->label('Type de réaction')
                            ->default('like')
                            ->native(false),
                    ])->columns(3),
            ]);
    }
}
