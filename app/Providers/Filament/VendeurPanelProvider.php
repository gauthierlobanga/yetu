<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Tenancy\EditVendeurProfile;
use App\Filament\Pages\Tenancy\RegisterVendeur;
use App\Http\Middleware\EnsureUserIsVendeur;
use App\Models\Tenant;
use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use Filament\Actions\Action;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;

// use Stancl\Tenancy\Middleware\InitializeTenancyByPath;

class VendeurPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('vendeur')
            ->path('vendeur')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->brandLogo(fn () => view('filament.admin.logo'))
            ->font('inter')
            ->sidebarWidth('16rem')
            ->profile()
            ->login()
            ->spa()
            ->navigationGroups(groups: [
                NavigationGroup::make()
                    ->label('Market')
                    ->icon(Heroicon::ShoppingBag),
                NavigationGroup::make()
                    ->label('Blog')
                    ->icon(Heroicon::Newspaper),
                NavigationGroup::make()
                    ->label('Contact')
                    ->icon(Heroicon::Inbox),
                NavigationGroup::make()
                    ->label('About')
                    ->icon(Heroicon::OutlinedInformationCircle),
                NavigationGroup::make()
                    ->label('Help')
                    ->icon(Heroicon::InformationCircle),
                NavigationGroup::make()
                    ->label('Parametrises')
                    ->icon(Heroicon::Cog8Tooth),
                NavigationGroup::make()
                    ->label('Comptes')
                    ->icon(Heroicon::UserGroup),
                NavigationGroup::make()
                    ->label('Organisation')
                    ->icon(Heroicon::BuildingOffice),
                NavigationGroup::make()
                    ->label('Tenants')
                    ->icon(Heroicon::BuildingOffice),
                NavigationGroup::make()
                    ->label('Clients')
                    ->icon(Heroicon::UserGroup),
                NavigationGroup::make()
                    ->label('Fournisseurs')
                    ->icon(Heroicon::Truck),
                NavigationGroup::make()
                    ->label('Core')
                    ->icon(Heroicon::Cog6Tooth),
                NavigationGroup::make()
                    ->label('Filament Shield')
                    ->icon(Heroicon::ShieldCheck),
                NavigationGroup::make()
                    ->label('Notifications')
                    ->icon(Heroicon::Bell),
            ])
            ->navigationItems([
                NavigationItem::make('Retour à l\'admin')
                    ->url('/admin')
                    ->icon('heroicon-o-arrow-right-circle')
                    ->sort(-1)
                    ->visible(fn () => Auth::user()?->hasRole('super_admin')),
            ])
            ->sidebarCollapsibleOnDesktop()
            ->collapsedSidebarWidth('9rem')
            ->colors([
                'danger' => Color::Red,
                'gray' => Color::Zinc,
                'info' => Color::Blue,
                'primary' => Color::Amber,
                'success' => Color::Green,
                'warning' => Color::Amber,
            ])
            ->discoverResources(in: app_path('Filament/Vendeur/Resources'), for: 'App\\Filament\\Vendeur\\Resources')
            ->discoverPages(in: app_path('Filament/Vendeur/Pages'), for: 'App\\Filament\\Vendeur\\Pages')
            ->discoverWidgets(in: app_path('Filament/Vendeur/Widgets'), for: 'App\\Filament\\Vendeur\\Widgets')
            ->discoverClusters(in: app_path('Filament/Vendeur/Clusters'), for: 'App\\Filament\\Vendeur\\Clusters')
            ->pages([
                Dashboard::class,
            ])
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestsDuringMaintenance::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,

            ])
            ->authMiddleware([
                Authenticate::class,
                EnsureUserIsVendeur::class,
                // InitializeTenancyByDomain::class,
            ])
            ->plugins(plugins: [
                FilamentShieldPlugin::make()
                    ->navigationLabel('Bouclier')                  // string|Closure|null
                    ->navigationIcon('heroicon-o-home')         // string|Closure|null
                    ->activeNavigationIcon('heroicon-s-home')   // string|Closure|null
                    // ->navigationGroup('Group')                  // string|Closure|null
                    ->tenantRelationshipName(null)           // string|Closure|null
                    ->tenantOwnershipRelationshipName(null) // string|Closure|null
                    ->navigationSort(10)                        // int|Closure|null
                    ->navigationBadge('5')                      // string|Closure|null
                    ->globallySearchable(true)                  // bool|Closure
                    ->globalSearchResultsLimit(50)              // int|Closure
                    ->navigationBadgeColor('success')           // string|Closure|null
                    ->gridColumns([
                        'default' => 1,
                        'sm' => 2,
                        'lg' => 3,
                    ])
                    ->sectionColumnSpan(1)
                    ->checkboxListColumns([
                        'default' => 1,
                        'sm' => 2,
                        'lg' => 4,
                    ])
                    ->resourceCheckboxListColumns([
                        'default' => 1,
                        'sm' => 2,
                    ]),

            ])
            ->tenant(Tenant::class, 'id')
            ->tenantDomain('{tenant:slug}.'.config('app.domain'))
            ->tenantRegistration(RegisterVendeur::class)
            ->tenantProfile(EditVendeurProfile::class)
            ->tenantMenuItems([
                'register' => fn (Action $action): Action => $action
                    ->label('Ajouter un vendeur')
                    ->icon('heroicon-o-plus-circle')
                    ->visible(fn (): bool => Auth::user()->hasRole('super_admin')),
                'profile' => fn (Action $action): Action => $action
                    ->label('Profil du vendeur')
                    ->icon('heroicon-o-cog-6-tooth'),
            ])
            // ->strictAuthorization()
            ->unsavedChangesAlerts()
            ->searchableTenantMenu()
            ->resourceEditPageRedirect('index')
            ->resourceCreatePageRedirect('index');
    }
}
