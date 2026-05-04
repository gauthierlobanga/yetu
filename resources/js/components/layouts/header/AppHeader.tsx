// resources/js/components/AppHeader.tsx
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ChooseYetuContent } from '@/components/navigation/ChooseYetuContent';
import { ProductsMenuContent } from '@/components/navigation/ProductsMenuContent';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useTenant } from '@/hooks/useTenant';
import type { BreadcrumbItem, NavItem } from '@/types';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { UserNavigation } from './UserNavigation';
import tenant from '@/routes/tenant';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const { isTenant } = useTenant();
    const { auth } = usePage().props;

    // Liens centraux (SaaS)
    const centralNavItems: NavItem[] = [
        { title: 'Choisir Yetu', content: <ChooseYetuContent />, href: '' },
        { title: 'Produits', content: <ProductsMenuContent />, href: '' },
        { title: 'Tarification', href: route('plan.index') },
        { title: 'Enterprise', href: route('entreprise.index') },
    ];

    // Liens pour les boutiques (tenants)
    const tenantNavItems: NavItem[] = [
        { title: 'Produits', href: route('tenant.product.index') },
        { title: 'Catégories', href: route('tenant.product.category.index') },
        { title: 'Promotions', href: route('tenant.promotions.index') },
        { title: 'Contact', href: route('tenant.page.contact') },
    ];

    const mainNavItems = isTenant ? tenantNavItems : centralNavItems;

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-gray-900/95">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
                    {/* Mobile Menu */}
                    <div className="mr-2 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    aria-label="Menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0">
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center gap-2">
                                        <AppLogoIcon className="h-6 w-6" />
                                        <span>Menu</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <MobileNavigation items={mainNavItems} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link
                        href={isTenant ? route('tenant.home') : route('home')}
                        className="flex shrink-0 items-center"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation (centrée) */}
                    <div className="hidden flex-1 justify-center lg:flex">
                        <MainNavigation items={mainNavItems} />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {!isTenant && (
                            <>
                                {/* Bouton connexion pour vendeur */}
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    asChild
                                    className="text-md font-medium"
                                >
                                    <Link href={tenant.login()}>
                                        {' '}
                                        {/* <-- modification */}
                                        Se connecter
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden rounded-full bg-primary px-4 py-5 text-base font-semibold text-primary-foreground transition hover:shadow-xs"
                                    asChild
                                >
                                    <Link href={route('vendor.register')}>
                                        <span className="relative z-10 flex items-center">
                                            Démarrer gratuitement
                                            <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                                        </span>
                                        {/* Effet de survol brillant */}
                                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                    </Link>
                                </Button>
                            </>
                        )}
                        {isTenant && (
                            <>
                                {/* Afficher connexion ou profil selon l'état */}
                                {auth.user ? (
                                    <UserNavigation user={auth.user} />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="text-sm font-medium"
                                    >
                                        <Link href={route('tenant.login')}>
                                            Se connecter
                                        </Link>
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="border-b border-border/40">
                    <div className="container mx-auto flex h-10 items-center px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
