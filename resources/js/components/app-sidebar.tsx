// resources/js/components/app-sidebar.tsx

import { Link, usePage } from '@inertiajs/react';
import { IconSettings } from '@tabler/icons-react';
import {
    LayoutGrid,
    ShoppingBag,
    Heart,
    Gift,
    MapPin,
    RotateCcw,
    Store,
    Bell,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/acheteur';
import { edit } from '@/routes/acheteur/profile';
import tenant from '@/routes/tenant';
import addresses from '@/routes/tenant/addresses';
import loyalty from '@/routes/tenant/loyalty';
import orders from '@/routes/tenant/orders';
import wishlist from '@/routes/tenant/wishlist';
import acheteurNotifications from '@/routes/acheteur/notifications';
import vendor from '@/routes/vendor';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

// ---------- Type local pour UrlMethodPair (si non exporté par @/types) ----------
type UrlMethodPair = {
    url: string;
    method?: string;
};

// ---------- Utilitaire pour extraire une string d'un href ----------
const getHrefString = (
    href: string | UrlMethodPair | undefined,
): string | null => {
    if (!href) {
        return null;
    }

    return typeof href === 'string' ? href : href.url;
};

// ---------- Composant ----------
export function AppSidebar() {
    const { auth, url } = usePage().props as any;
    const user = auth?.user;

    const isVendor =
        user?.tenants?.length > 0 ||
        user?.roles?.some(
            (r: any) => r.name === 'super_admin' || r.name === 'manager',
        );

    // Fonction pour déterminer l'état actif
    const isActive = (href: string | UrlMethodPair | undefined): boolean => {
        const hrefStr = getHrefString(href);

        if (!hrefStr) {
            return false;
        }

        return url === hrefStr || url?.startsWith(hrefStr + '/');
    };

    // Enrichir les items avec la propriété `isActive`
    const enhanceItems = (items: NavItem[]): NavItem[] =>
        items.map((item) => ({
            ...item,
            isActive: isActive(item.href),
        }));

    const navigationSections = [
        {
            title: 'Principal',
            items: enhanceItems([
                {
                    title: 'Tableau de bord',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ]),
        },
        {
            title: 'Achats',
            items: enhanceItems([
                {
                    title: 'Mes commandes',
                    href: orders.index().url,
                    icon: ShoppingBag,
                },
                {
                    title: 'Liste de souhaits',
                    href: wishlist.index().url,
                    icon: Heart,
                },
                {
                    title: 'Programme fidélité',
                    href: loyalty.index().url,
                    icon: Gift,
                },
                {
                    title: 'Adresses',
                    href: addresses.index().url,
                    icon: MapPin,
                },
                {
                    title: 'Retours & SAV',
                    href: tenant.return.index().url,
                    icon: RotateCcw,
                },
            ]),
        },
        {
            title: 'Compte',
            items: enhanceItems([
                {
                    title: 'Notifications',
                    href: acheteurNotifications.index().url,
                    icon: Bell,
                },
                {
                    title: 'Paramètres',
                    href: edit(),
                    icon: IconSettings,
                },
            ]),
        },
    ];

    const vendorSection = isVendor
        ? {
              title: 'Espace vendeur',
              items: enhanceItems([
                  {
                      title: 'Ma boutique',
                      href: vendor.dashboard().url,
                      icon: Store,
                  },
              ]),
          }
        : null;

    return (
        <Sidebar
            variant="inset"
            className={cn(
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-transparent',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88',
            )}
        >
            {/* Logo */}
            <SidebarHeader className="relative border-b border-slate-200/60 px-3 py-4 pb-2 dark:border-slate-800/70 dark:bg-slate-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link
                                className={cn(
                                    'group flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                    'text-slate-600 hover:bg-slate-100 hover:text-emerald-700',
                                    'dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-emerald-300',
                                )}
                                href={dashboard()}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="gap-6 px-3 py-4 dark:bg-slate-900">
                {navigationSections.map((section, index) => (
                    <div key={section.title}>
                        {index > 0 && <SidebarSeparator className="my-3" />}
                        <h2 className="mb-2 ml-3 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                            {section.title}
                        </h2>
                        <NavMain items={section.items} />
                    </div>
                ))}
                {vendorSection && (
                    <div>
                        <SidebarSeparator className="my-3" />
                        <h2 className="mb-2 ml-3 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                            {vendorSection.title}
                        </h2>
                        <NavMain items={vendorSection.items} />
                    </div>
                )}
            </SidebarContent>

            {/* Footer utilisateur */}
            <SidebarFooter   className={cn(
                'border-t border-slate-200/60 px-3 py-4 pb-2 dark:border-slate-800/70 dark:bg-slate-900'
            )} >
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
