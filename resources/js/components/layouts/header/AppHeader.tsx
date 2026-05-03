import { Link, usePage } from '@inertiajs/react';
import { List, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { home } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';
import { HeaderActions } from './HeaderActions';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { UserNavigation } from './UserNavigation';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export const mainNavItems: NavItem[] = [
    {
        title: 'Boutiques',
        href: '',
    },
    {
        title: 'Services',
        href: '',
    },
    {
        title: 'Contact',
        href: route('page.contact'),
    },
    {
        title: 'À propos',
        href: route('page.about'),
    },
    {
        title: 'Blog',
        href: route('blog.index'),
    },
];

export const mainNavSubItems: NavItem[] = [
    {
        title: 'Toutes les catégories',
        href: route('product.category.index'),
        icon: List,
    },
    {
        title: 'Devennir vendeur',
        href: route('vendor.register'),
    },
    {
        title: 'Centre des acheteurs',
        href: '',
    },
    {
        title: 'Fournisseurs',
        href: '/',
    },
    {
        title: 'Fabricants',
        href: '',
    },
];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="mx-auto flex h-16 items-center px-14 md:min-w-5xl">
                    {/* Mobile Menu */}
                    <div className="mr-4 lg:hidden">
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
                            <SheetContent
                                aria-describedby={undefined}
                                side="left"
                                className="w-72 p-0"
                            >
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center">
                                        <AppLogoIcon className="mr-2 h-6 w-6" />
                                        <span>Menu</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <MobileNavigation items={mainNavItems} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link
                        href={route('home')}
                        prefetch
                        className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden lg:block">
                        <MainNavigation items={mainNavItems} />
                    </div>

                    {/* Right Section */}
                    <div className="ml-auto flex items-center space-x-2">
                        <HeaderActions />
                        <UserNavigation user={auth.user} />
                    </div>
                </div>
                <div className="mx-auto flex h-10 items-center px-5 md:min-w-5xl">
                    {/* Mobile Menu */}
                    <div className="mr-4 lg:hidden">
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
                            <SheetContent
                                aria-describedby={undefined}
                                side="left"
                                className="w-72 p-0"
                            >
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center">
                                        <AppLogoIcon className="mr-2 h-6 w-6" />
                                        <span>Menu</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <MobileNavigation items={mainNavItems} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden lg:block">
                        <MainNavigation items={mainNavSubItems} />
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="container mx-auto border-b border-border/40 px-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 items-center">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
