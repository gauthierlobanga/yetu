import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Factory } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppearanceToogle from '@/components/appearance-toogle';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCategoryMenuContent } from '@/components/navigation/categorie-produits-explorer/ProductsMenuContent';
import { CentreAcheteurs } from '@/components/navigation/CentreAcheteurs';
import { Support } from '@/components/navigation/Support';
import SearchExperience from '@/components/search-my-input';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { login } from '@/routes/tenant';
import type { BreadcrumbItem, NavItem } from '@/types';
import { CartButton } from './CartButton';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { NotificationsDropdown } from './NotificationsDropdown';
import { RegionSelectorForm } from './RegionSelectorForm';
import { UserNavigation } from './UserNavigation';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function VendorHeader({ breadcrumbs = [] }: Props) {
    const { auth } = usePage().props as any;

    const vendorNavItems: NavItem[] = [
        {
            title: 'Explorer les catégories',
            content: <ProductCategoryMenuContent />,
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
        {
            title: 'Les fabricants',
            icon: Factory,
            href: '#', // TODO: create the route and change this later
        },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80"
            >
                {/* Ligne Supérieure : Logo, Recherche, Actions */}
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    {/* Menu mobile (hamburger) */}
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
                                        <AppLogo />
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex h-full flex-col">
                                    <div className="flex-1 overflow-y-auto">
                                        <MobileNavigation
                                            items={vendorNavItems}
                                        />
                                    </div>
                                    <div className="mt-auto shrink-0 border-t border-slate-200 p-5 dark:border-slate-700">
                                        <div className="mb-6 flex items-center justify-between gap-4 sm:hidden">
                                            <RegionSelectorForm />
                                            <AppearanceToogle />
                                        </div>
                                        {!auth.user ? (
                                            <Button
                                                asChild
                                                className="w-full"
                                                size="lg"
                                            >
                                                <Link href={login()}>
                                                    Se connecter
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                asChild
                                                className="w-full"
                                                size="lg"
                                            >
                                                <Link
                                                    href={route(
                                                        'central.account-selection.index',
                                                    )}
                                                >
                                                    Accéder aux boutiques
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo & App Name */}
                    <div className="flex shrink-0 items-center">
                        <Link
                            href={route('tenant.home')}
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <AppLogo hideIconOnMobile />
                        </Link>
                    </div>

                    {/* Zone moderne de recherche (Centre) */}
                    <div className="hidden max-w-4xl flex-1 px-6 lg:block">
                        <SearchExperience
                            showImageSearch={true}
                            onImageSearch={(file) => {
                                console.log('Image pour recherche:', file);
                                // TODO: implémenter la logique d'envoi vers l'API d'IA
                            }}
                        />
                    </div>

                    {/* Actions à droite */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:block">
                            <RegionSelectorForm />
                        </div>
                        <div className="hidden sm:block">
                            <AppearanceToogle />
                        </div>
                        <CartButton />
                        {auth.user && <NotificationsDropdown />}

                        {auth.user ? (
                            <UserNavigation user={auth.user} />
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="hidden text-sm font-medium sm:inline-flex"
                            >
                                <Link href={login()}>Se connecter</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Ligne 2 (Mobile & Tablette) : Recherche + Explorer */}
                <div className="flex items-center gap-2 border-t border-slate-100 p-3 lg:hidden dark:border-slate-800">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex shrink-0 items-center gap-2 rounded-xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                            >
                                <Menu className="h-4 w-4" />
                                <span>Explorer</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <SheetHeader className="border-b border-slate-200 p-5 dark:border-slate-700">
                                <SheetTitle>Catégories</SheetTitle>
                            </SheetHeader>
                            <div className="flex h-full flex-col overflow-y-auto">
                                <MobileNavigation items={[vendorNavItems[0]]} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1">
                        <SearchExperience
                            showImageSearch={true}
                            onImageSearch={(file) => {
                                console.log('Image pour recherche:', file);
                            }}
                            buttonProps={{ className: 'w-full' }}
                        />
                    </div>
                </div>

                {/* Ligne Inférieure : Navigation dropdown & Nouveaux liens */}
                <div className="hidden border-t border-slate-100 lg:block dark:border-slate-800">
                    <div className="mx-auto flex h-12 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Menus de gauche */}
                        <div className="flex h-full items-center">
                            <MainNavigation
                                items={vendorNavItems}
                                topClass="top-[113px]"
                            />
                        </div>

                        {/* Liens additionnels à droite */}
                        <div className="flex h-full items-center gap-6">
                            <Link
                                href="#"
                                className="group inline-flex items-center text-base font-medium text-slate-500 transition-colors dark:text-slate-400"
                            >
                                <span className="relative">
                                    Ventes Flash
                                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Link>
                            <Link
                                href="#"
                                className="group inline-flex items-center text-base font-medium text-slate-500 transition-colors dark:text-slate-400"
                            >
                                <span className="relative">
                                    Nouveautés
                                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Link>
                        </div>
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
