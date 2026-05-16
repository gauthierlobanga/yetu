/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    ChevronDown,
    Tag,
    Warehouse,
    Users,
    Rocket,
    Sparkles,
    ArrowRight,
    BookOpen,
    ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export function VendorSidebar({ tenant }: { tenant: Tenant }) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const navigation = [
        {
            title: 'Accueil',
            icon: LayoutDashboard,
            href: route('vendor.dashboard'),
        },
        {
            title: 'Produits',
            icon: Package,
            children: [
                {
                    title: 'Tous les produits',
                    href: route('dashboard.products.index'),
                },
                {
                    title: 'Catégories',
                    href: `${tenant.admin_url}/products/product-categories`,
                },
                {
                    title: 'Promotions',
                    href: `${tenant.admin_url}/promotions/promotions`,
                },
                {
                    title: 'Fournisseurs',
                    href: `${tenant.admin_url}/fournisseurs`,
                },
                {
                    title: 'Variantes',
                    href: `${tenant.admin_url}/products/variante-produits`,
                },
                {
                    title: 'Marques',
                    href: `${tenant.admin_url}/products/brands`,
                },
            ],
        },
        {
            title: 'Commandes',
            icon: ShoppingCart,
            children: [
                {
                    title: 'Commandes clients',
                    href: `${tenant.admin_url}/commandes/commandes`,
                },
                {
                    title: 'Lignes de commande',
                    href: `${tenant.admin_url}/ligne-commandes`,
                },
                {
                    title: 'Commandes achat',
                    href: `${tenant.admin_url}/commandes-achat`,
                },
                {
                    title: 'Retours',
                    href: `${tenant.admin_url}/commandes/retours`,
                },
                {
                    title: 'Paniers',
                    href: `${tenant.admin_url}/paniers/paniers`,
                },
            ],
        },
        {
            title: 'Marketing',
            icon: Tag,
            children: [
                {
                    title: 'Promotions',
                    href: `${tenant.admin_url}/promotions/promotions`,
                },
                {
                    title: 'Coupons',
                    href: `${tenant.admin_url}/inventor/coupons`,
                },
                {
                    title: 'Wishlist',
                    href: `${tenant.admin_url}/wishlists/wishlists`,
                },
            ],
        },
        {
            title: 'Blog',
            icon: BookOpen,
            children: [
                { title: 'Tableau de bord', href: route('profile.destroy') },
                { title: 'Posts', href: `${tenant.admin_url}/posts/posts` },
                {
                    title: 'Catégories',
                    href: `${tenant.admin_url}/posts/categories`,
                },
            ],
        },
        {
            title: 'Inventaire',
            icon: Warehouse,
            children: [
                {
                    title: 'Stock',
                    href: `${tenant.admin_url}/inventor/mouvement-stocks`,
                },
                {
                    title: 'Inventaires',
                    href: `${tenant.admin_url}/inventor/inventaires`,
                },
                {
                    title: 'Entrepôts',
                    href: `${tenant.admin_url}/inventor/entrepots`,
                },
            ],
        },
        {
            title: 'Clients',
            icon: Users,
            children: [
                { title: 'Clients', href: `${tenant.admin_url}/clients` },
                { title: 'Adresses', href: `${tenant.admin_url}/adresses` },
            ],
        },
        {
            title: 'Statistiques',
            icon: BarChart3,
            href: route('vendor.statistics'),
        },
        {
            title: 'Paramètres',
            icon: Settings,
            href: route('vendor.settings'),
        },
        {
            title: 'Profile',
            icon: Settings,
            href: route('profile.destroy'),
        },
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-white/80 backdrop-blur-xl dark:border-emerald-900/30 dark:bg-slate-900"
        >
            <SidebarHeader className="flex items-center gap-2 px-4 py-4 dark:bg-slate-900">
                {tenant.logo_url ? (
                    <img
                        src={tenant.logo_url}
                        alt={tenant.raison_sociale}
                        className="h-10 w-10 rounded-lg object-cover shadow-sm"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                )}
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                        {tenant.raison_sociale}
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 dark:bg-slate-900">
                <SidebarGroup>
                    <SidebarMenu>
                        {navigation.map((item) => {
                            const isOpen = openMenus[item.title] ?? false;

                            if (item.children) {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {isCollapsed ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className="group flex w-full items-center justify-between rounded-lg transition-all duration-200 ease-in-out hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20"
                                                    >
                                                        <item.icon className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-300" />
                                                    </SidebarMenuButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="start"
                                                    side="right"
                                                    className="w-48 border-slate-200 dark:border-slate-700"
                                                >
                                                    {item.children.map(
                                                        (child) => (
                                                            <DropdownMenuItem
                                                                key={
                                                                    child.title
                                                                }
                                                                asChild
                                                            >
                                                                <a
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    {
                                                                        child.title
                                                                    }
                                                                </a>
                                                            </DropdownMenuItem>
                                                        ),
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <>
                                                <SidebarMenuButton
                                                    onClick={() =>
                                                        toggleMenu(item.title)
                                                    }
                                                    className={cn(
                                                        'group flex w-full items-center justify-between rounded-lg transition-all duration-200',
                                                        'hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm',
                                                        'dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10',
                                                        isOpen &&
                                                            'bg-emerald-50 dark:bg-emerald-900/90',
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <item.icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                            {item.title}
                                                        </span>
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-4 w-4 text-slate-400 transition-all',
                                                            isOpen &&
                                                                'rotate-180',
                                                            'group-hover:text-emerald-500 dark:group-hover:text-emerald-300',
                                                        )}
                                                    />
                                                </SidebarMenuButton>

                                                <AnimatePresence
                                                    initial={false}
                                                >
                                                    {isOpen && (
                                                        <motion.div
                                                            key="content"
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                height: 'auto',
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                                ease: 'easeInOut',
                                                            }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mx-2 mt-1 mb-2 rounded-xl border border-emerald-100 bg-emerald-50/30 p-2 shadow-sm backdrop-blur-sm dark:border-emerald-900/30 dark:bg-emerald-900/20">
                                                                {item.children.map(
                                                                    (child) => (
                                                                        <a
                                                                            key={
                                                                                child.title
                                                                            }
                                                                            href={
                                                                                child.href
                                                                            }
                                                                            className="group/sub flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/80 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-emerald-300"
                                                                        >
                                                                            <span className="flex-1">
                                                                                {
                                                                                    child.title
                                                                                }
                                                                            </span>
                                                                            <ArrowRight className="h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-all group-hover/sub:translate-x-0.5 group-hover/sub:text-emerald-500 group-hover/sub:opacity-100 dark:group-hover/sub:text-emerald-300" />
                                                                        </a>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </SidebarMenuItem>
                                );
                            }

                            // Élément simple
                            return (
                                // Élément simple dans la navigation
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={
                                            isCollapsed ? item.title : undefined
                                        }
                                    >
                                        <Link
                                            href={item.href ?? '#'}
                                            className="group flex items-center gap-3 rounded-lg transition-all duration-200 hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10"
                                        >
                                            <item.icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {item.title}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-3 pb-4 group-data-[collapsible=icon]:hidden dark:bg-slate-900">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-4 text-white shadow-lg shadow-emerald-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-300 dark:from-emerald-600 dark:to-emerald-800 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/50">
                    <div className="mb-2 flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        <span className="text-sm font-semibold">
                            {tenant.plan?.name ?? 'Plan Gratuit'}
                        </span>
                    </div>
                    <p className="mb-3 text-xs text-emerald-100">
                        Passez à un plan supérieur pour débloquer plus de
                        fonctionnalités.
                    </p>
                    <Button
                        asChild
                        size="sm"
                        className="w-full rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/30"
                    >
                        <Link href={route('vendor.payment')}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Changer de plan
                            <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
