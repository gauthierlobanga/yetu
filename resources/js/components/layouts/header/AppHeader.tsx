// resources/js/components/layout/AppHeader.tsx
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, List, Menu, SearchIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCategoryMenuContent } from '@/components/navigation/categorie-produits-explorer/ProductsMenuContent';
import { CentreAcheteurs } from '@/components/navigation/CentreAcheteurs';
import { ChooseYetuContent } from '@/components/navigation/ChooseYetuContent';
import { ProductsMenuContent } from '@/components/navigation/ProductsMenuContent';
import { Support } from '@/components/navigation/Support';
import SearchExperience from '@/components/search-my-input'; // uniquement pour la recherche mobile
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useTenant } from '@/hooks/useTenant';
import { login } from '@/routes/tenant';
import type { BreadcrumbItem, NavItem } from '@/types';
import { HeaderActions } from './HeaderActions';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { UserNavigation } from './UserNavigation';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const { isTenant } = useTenant();
    const { auth } = usePage().props;

    const centralNavItems: NavItem[] = [
        { title: 'Choisir Yetu', content: <ChooseYetuContent />, href: '' },
        { title: 'Produits', content: <ProductsMenuContent />, href: '' },
        { title: 'Tarification', href: route('plan.index') },
        { title: 'Enterprise', href: route('entreprise.index') },
    ];

    const tenantNavItems: NavItem[] = [
        {
            title: 'Explorer les catégories',
            content: <ProductCategoryMenuContent />,
            icon: List,
            href: '',
        },
        {
            title: "Centre d'acheteurs",
            content: <CentreAcheteurs />,
            href: '',
        },
        {
            title: 'Support',
            content: <Support />,
            href: '',
        },
    ];

    const mainNavItems = isTenant ? tenantNavItems : centralNavItems;

    return (
        <>
            <motion.header
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80"
            >
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    {/* Menu mobile */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    aria-label="Menu principal"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <SheetHeader className="border-b border-slate-200 p-5 dark:border-slate-700">
                                    <SheetTitle className="flex items-center gap-3">
                                        <AppLogoIcon className="h-7 w-7" />
                                        <span className="text-lg font-bold text-slate-800 dark:text-white">
                                            Menu
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex h-full flex-col justify-between">
                                    <MobileNavigation items={mainNavItems} />
                                    <div className="border-t border-slate-200 p-5 dark:border-slate-700">
                                        {!auth.user && isTenant && (
                                            <Button
                                                asChild
                                                className="w-full"
                                                size="lg"
                                            >
                                                <Link href={login()}>
                                                    Se connecter
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <div className="flex shrink-0 items-center">
                        <Link
                            href={
                                isTenant ? route('tenant.home') : route('home')
                            }
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Navigation principale desktop */}
                    <div className="hidden h-full items-center lg:flex">
                        <MainNavigation items={mainNavItems} />
                    </div>

                    {/* Actions à droite */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Recherche mobile (tenant) */}
                        {isTenant && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                        aria-label="Rechercher"
                                    >
                                        <SearchIcon className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="top" className="p-4 pt-6">
                                    <SearchExperience
                                        buttonText="Rechercher..."
                                        hitsPerPage={5}
                                    />
                                </SheetContent>
                            </Sheet>
                        )}

                        {!isTenant ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline-flex dark:text-slate-300 dark:hover:text-white"
                                >
                                    <Link href={login()}>Se connecter</Link>
                                </Button>
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden rounded-full bg-linear-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-300 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/40"
                                    asChild
                                >
                                    <Link href={route('vendor.register')}>
                                        <span className="relative z-10 flex items-center">
                                            Démarrer gratuitement
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* HeaderActions contient déjà SearchExperience (desktop), RegionSelector, Notifications, Cart, etc. */}
                                <HeaderActions />
                                {auth.user ? (
                                    <UserNavigation user={auth.user} />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="text-sm font-medium"
                                    >
                                        <Link href={login()}>Se connecter</Link>
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Breadcrumbs */}
            <AnimatePresence>
                {breadcrumbs.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-200/60 dark:border-slate-700/50"
                    >
                        <div className="container mx-auto flex h-10 items-center px-4 sm:px-6 lg:px-8">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
