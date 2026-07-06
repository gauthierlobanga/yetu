<?php

namespace App\Filament\Vendeur\Clusters\Settings\Pages;

use App\Filament\Vendeur\Clusters\Settings\SettingsCluster;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CookieSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $cluster = SettingsCluster::class;

    public static function getNavigationIcon(): string|BackedEnum|null
    {
        return 'heroicon-o-adjustments-horizontal';
    }

    protected static ?string $navigationLabel = 'Bannière de Cookies';

    protected static ?string $title = 'Paramètres des Cookies';

    protected string $view = 'filament.vendeur.pages.cookie-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $tenant = tenant();

        $this->form->fill($tenant->getConfiguration('cookie_settings', [
            'enabled' => true,
            'title' => 'Respect de votre vie privée',
            'message' => 'Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés.',
            'button_accept' => 'Tout accepter',
            'button_decline' => 'Continuer sans accepter',
            'button_customize' => 'Personnaliser',
            'cookie_definitions' => [
                [
                    'category' => 'necessary',
                    'name' => 'Cookies Strictement Nécessaires',
                    'description' => 'Ces cookies sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés.',
                    'required' => true,
                ],
                [
                    'category' => 'analytics',
                    'name' => 'Cookies Analytiques',
                    'description' => 'Permettent de mesurer l\'audience et d\'améliorer les performances du site.',
                    'required' => false,
                ],
            ],
        ]));
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Activation')
                    ->description('Contrôlez l\'affichage de la bannière de consentement sur votre boutique.')
                    ->schema([
                        Toggle::make('enabled')
                            ->label('Activer la bannière de cookies')
                            ->helperText('Si désactivé, la bannière ne s\'affichera pas sur votre boutique.')
                            ->default(true),
                    ]),

                Section::make('Textes de la bannière')
                    ->description('Personnalisez le message affiché à vos visiteurs.')
                    ->schema([
                        TextInput::make('title')
                            ->label('Titre de la bannière')
                            ->required()
                            ->default('Respect de votre vie privée')
                            ->maxLength(255),
                        Textarea::make('message')
                            ->label('Message d\'information')
                            ->required()
                            ->default('Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés.')
                            ->rows(3),
                    ]),

                Section::make('Boutons')
                    ->description('Personnalisez le texte des boutons d\'action.')
                    ->schema([
                        TextInput::make('button_accept')
                            ->label('Texte du bouton Accepter')
                            ->required()
                            ->default('Tout accepter'),
                        TextInput::make('button_decline')
                            ->label('Texte du bouton Refuser')
                            ->required()
                            ->default('Continuer sans accepter'),
                        TextInput::make('button_customize')
                            ->label('Texte du bouton Personnaliser')
                            ->required()
                            ->default('Personnaliser'),
                    ])->columns(3),

                Section::make('Définition des Cookies (Pour Personnalisation)')
                    ->description('Définissez les catégories de cookies que votre boutique utilise. Ces informations seront affichées aux visiteurs lorsqu\'ils cliqueront sur "Personnaliser".')
                    ->schema([
                        Repeater::make('cookie_definitions')
                            ->label('Catégories de cookies')
                            ->schema([
                                TextInput::make('category')
                                    ->label('Identifiant de la catégorie')
                                    ->required()
                                    ->helperText('Ex: necessary, analytics, marketing')
                                    ->maxLength(50),
                                TextInput::make('name')
                                    ->label('Nom affiché')
                                    ->required()
                                    ->maxLength(255),
                                Textarea::make('description')
                                    ->label('Description')
                                    ->required()
                                    ->rows(2),
                                Toggle::make('required')
                                    ->label('Obligatoire')
                                    ->helperText('L\'utilisateur ne pourra pas décocher cette catégorie.')
                                    ->default(false),
                            ])
                            ->columns(2)
                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                            ->addActionLabel('Ajouter une catégorie')
                            ->collapsible()
                            ->defaultItems(2),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $tenant = tenant();

        $tenant->setConfiguration('cookie_settings', $this->form->getState());
        $tenant->save();

        Notification::make()
            ->success()
            ->title('Paramètres sauvegardés')
            ->body('Les paramètres de la bannière de cookies ont été mis à jour.')
            ->send();
    }
}
