<?php

namespace App\Filament\Vendeur\Resources\CookieConsents;

use App\Filament\Vendeur\Clusters\Settings\SettingsCluster;
use App\Filament\Vendeur\Resources\CookieConsents\Pages\ManageCookieConsents;
use App\Models\CookieConsent;
use BackedEnum;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CookieConsentResource extends Resource
{
    protected static ?string $model = CookieConsent::class;

    protected static ?string $cluster = SettingsCluster::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationLabel = 'Journal des consentements';

    protected static ?string $modelLabel = 'Consentement';

    protected static ?string $pluralModelLabel = 'Consentements';

    protected static ?string $recordTitleAttribute = 'ip_address';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    /**
     * Charge la relation user pour éviter les requêtes N+1.
     */
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['user']);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('ip_address')
                    ->label('Adresse IP')
                    ->placeholder('-'),

                TextEntry::make('session_id')
                    ->label('ID Session')
                    ->placeholder('-'),

                TextEntry::make('user.name')
                    ->label('Utilisateur')
                    ->placeholder('Visiteur anonyme'),

                TextEntry::make('created_at')
                    ->label('Date')
                    ->dateTime(),

                TextEntry::make('preferences')
                    ->label('Préférences')
                    ->formatStateUsing(function ($state) {
                        // S'assurer que $state est un tableau
                        if (! is_array($state)) {
                            if (is_string($state)) {
                                $decoded = json_decode($state, true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                    $state = $decoded;
                                } else {
                                    return $state ?? 'Aucune donnée';
                                }
                            } else {
                                return 'Aucune donnée';
                            }
                        }

                        $labels = [
                            'necessary' => 'Nécessaires',
                            'analytics' => 'Analytiques',
                            'marketing' => 'Marketing',
                            'preferences' => 'Préférences',
                        ];

                        $lines = [];
                        foreach ($state as $key => $val) {
                            $status = ($val === true || $val === 'true' || $val === 1 || $val === '1')
                                ? '✅ Accepté'
                                : '❌ Refusé';
                            $lines[] = ($labels[$key] ?? $key).': '.$status;
                        }

                        return implode("\n", $lines);
                    })
                    ->columnSpanFull()
                    ->extraAttributes(['style' => 'white-space: pre-wrap;']),

                TextEntry::make('user_agent')
                    ->label('Navigateur')
                    ->placeholder('-')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->searchable(),

                TextColumn::make('user.name')
                    ->label('Utilisateur')
                    ->searchable()
                    ->placeholder('Visiteur')
                    ->default('Visiteur'),

                TextColumn::make('preferences')
                    ->label('Choix')
                    ->badge()
                    ->formatStateUsing(function ($state) {
                        // S'assurer que $state est un tableau
                        if (! is_array($state)) {
                            if (is_string($state)) {
                                $decoded = json_decode($state, true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                    $state = $decoded;
                                } else {
                                    return 'Inconnu';
                                }
                            } else {
                                return 'Inconnu';
                            }
                        }

                        $labels = [
                            'necessary' => 'Nécessaires',
                            'analytics' => 'Analytiques',
                            'marketing' => 'Marketing',
                            'preferences' => 'Préférences',
                        ];

                        $accepted = [];
                        foreach ($state as $key => $val) {
                            if ($val === true || $val === 'true' || $val === 1 || $val === '1') {
                                $accepted[] = $labels[$key] ?? $key;
                            }
                        }

                        if (empty($accepted)) {
                            return 'Tout refusé';
                        }

                        return implode(', ', $accepted);
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'Tout refusé' => 'danger',
                        default => 'success',
                    }),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCookieConsents::route('/'),
        ];
    }
}
