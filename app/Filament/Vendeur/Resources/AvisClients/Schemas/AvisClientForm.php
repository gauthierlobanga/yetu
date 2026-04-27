<?php

namespace App\Filament\Vendeur\Resources\AvisClients\Schemas;

use App\Models\Tenant;
use Filament\Facades\Filament;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class AvisClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informations de l\'avis')
                    ->description('Détails de l\'avis client')
                    ->icon('heroicon-o-star')
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
                        Select::make('client_id')
                            ->relationship(
                                name: 'client',
                                titleAttribute: 'nom' // Changé de 'name' à 'nom'
                            )
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Client')
                            ->selectablePlaceholder(false) // Remplace placeholder()
                            ->createOptionForm([
                                TextInput::make('nom')->required(), // Changé de 'name' à 'nom'
                                TextInput::make('email')->email()->required(),
                            ]),

                        Select::make('produit_id')
                            ->relationship(
                                name: 'produit',
                                titleAttribute: 'nom' // Assurez-vous que c'est bien 'nom' et non 'name'
                            )
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Produit concerné')
                            ->selectablePlaceholder(false),

                        Select::make('note')
                            ->options([
                                1 => '⭐ (1/5) - Très mauvais',
                                2 => '⭐⭐ (2/5) - Mauvais',
                                3 => '⭐⭐⭐ (3/5) - Moyen',
                                4 => '⭐⭐⭐⭐ (4/5) - Bon',
                                5 => '⭐⭐⭐⭐⭐ (5/5) - Excellent',
                            ])
                            ->required()
                            ->label('Note')
                            ->native(false)
                            ->default(5),
                    ])->columns(3),

                Section::make('Contenu de l\'avis')
                    ->icon('heroicon-o-chat-bubble-left')
                    ->schema([
                        Textarea::make('commentaire')
                            ->label('Commentaire du client')
                            ->rows(4)
                            ->columnSpanFull()
                            ->maxLength(1000)
                            ->hint(fn ($state) => strlen($state ?? '').'/1000 caractères'),

                        Textarea::make('reponse')
                            ->label('Réponse de l\'administration')
                            ->rows(4)
                            ->columnSpanFull()
                            ->maxLength(1000)
                            ->hint(fn ($state) => strlen($state ?? '').'/1000 caractères')
                            ->helperText('Cette réponse sera visible publiquement'),
                    ]),

                Section::make('Paramètres de publication')
                    ->icon('heroicon-o-cog')
                    ->schema([
                        Toggle::make('approuve')
                            ->label('Avis approuvé')
                            ->helperText('L\'avis ne sera visible que s\'il est approuvé')
                            ->default(true)
                            ->inline(false),

                        DateTimePicker::make('date_avis')
                            ->label('Date de l\'avis')
                            ->default(now())
                            ->required()
                            ->displayFormat('d/m/Y H:i')
                            ->weekStartsOnMonday(),

                        Placeholder::make('info_publication')
                            ->content(fn (Get $get) => $get('approuve')
                                    ? '✅ Cet avis sera visible publiquement'
                                    : '⏸️ Cet avis est en attente de validation'
                            )
                            ->hidden(fn (Get $get) => ! $get('date_avis')),
                    ])->columns(2),
            ]);
    }
}
