<?php

namespace App\Filament\Pages;

use App\Enums\NavigationGroup;
use App\Settings\SettingApp;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use UnitEnum;

class ManageAppSettings extends SettingsPage
{
    protected static string $settings = SettingApp::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Profile;

    protected static ?string $navigationLabel = 'Paramètres généraux';

    protected static ?string $title = 'Paramètres de l’application';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom de l’application')
                    ->required()
                    ->maxLength(255),

                FileUpload::make('logo_url')
                    ->label('Logo')
                    ->image()
                    ->disk('public')
                    ->directory('settings')
                    ->visibility('public')
                    ->maxSize(1024)
                    ->afterStateHydrated(function ($component, $state, SettingApp $settings) {
                        $component->state($settings->logo_url);
                    })
                    ->dehydrateStateUsing(function ($state) {

                        if ($state instanceof TemporaryUploadedFile) {
                            // Supprimer l'ancien logo
                            $oldLogo = app(SettingApp::class)->logo_url;
                            if ($oldLogo) {
                                $oldPath = str_replace('/storage/', '', $oldLogo);
                                Storage::disk('public')->delete($oldPath);
                            }
                            // Stocker le nouveau
                            $path = $state->store('settings', 'public');

                            return '/storage/'.$path;
                        }

                        return $state;
                    }),
            ]);
    }
}
