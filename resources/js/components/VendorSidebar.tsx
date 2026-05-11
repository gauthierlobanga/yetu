// resources/js/components/VendorSidebar.tsx
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
    Store,
    Rocket,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface Tenant {
    id: string;
    raison_sociale: string;
    slug: string;
    admin_url: string;
    url: string;
    plan?: { name: string; price: number; currency: string } | null;
    is_active: boolean;
}

export function VendorSidebar({ tenant }: { tenant: Tenant }) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const navigation = [
        {
            title: 'Tableau de bord',
            icon: LayoutDashboard,
            href: route('vendor.dashboard'),
        },
        {
            title: 'Produits',
            icon: Package,
            children: [
                {
                    title: 'Tous les produits',
                    href: `${tenant.admin_url}/products/produits`,
                },
                {
                    title: 'Catégories',
                    href: `${tenant.admin_url}/produit-categories`,
                },
                { title: 'Promotions', href: `${tenant.admin_url}/promotions` },
                {
                    title: 'Fournisseurs',
                    href: `${tenant.admin_url}/fournisseurs`,
                },
                { title: 'Variantes', href: `${tenant.admin_url}/variantes` },
                { title: 'Marques', href: `${tenant.admin_url}/marques` },
            ],
        },
        {
            title: 'Commandes',
            icon: ShoppingCart,
            children: [
                {
                    title: 'Commandes clients',
                    href: `${tenant.admin_url}/commandes`,
                },
                {
                    title: 'Lignes de commande',
                    href: `${tenant.admin_url}/ligne-commandes`,
                },
                {
                    title: 'Commandes achat',
                    href: `${tenant.admin_url}/commandes-achat`,
                },
                { title: 'Retours', href: `${tenant.admin_url}/retours` },
                { title: 'Paniers', href: `${tenant.admin_url}/paniers` },
            ],
        },
        {
            title: 'Marketing',
            icon: Tag,
            children: [
                { title: 'Promotions', href: `${tenant.admin_url}/promotions` },
                { title: 'Coupons', href: `${tenant.admin_url}/coupons` },
                { title: 'Wishlist', href: `${tenant.admin_url}/wishlists` },
            ],
        },
        {
            title: 'Inventaire',
            icon: Warehouse,
            children: [
                { title: 'Stock', href: `${tenant.admin_url}/stock` },
                {
                    title: 'Inventaires',
                    href: `${tenant.admin_url}/inventaires`,
                },
                { title: 'Entrepôts', href: `${tenant.admin_url}/entrepots` },
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
            href: `${tenant.admin_url}/statistiques`,
        },
        {
            title: 'Paramètres',
            icon: Settings,
            href: route('vendor.configure'),
        },
    ];

    return (
        <Sidebar className="dark:bg-slate-900/90border border-slate-200 bg-white transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:border-emerald-900/30 dark:bg-slate-800 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20">
            {/* <Sidebar className="border-r border-emerald-100 bg-white/80 backdrop-blur-xl dark:border-emerald-900/30 dark:bg-slate-900/90"> */}
            <SidebarHeader className="flex items-center gap-2 px-4 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
                    <Store className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {tenant.raison_sociale}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tenant.is_active ? 'Actif' : 'Inactif'}
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navigation.map((item) => {
                            const isOpen = openMenus[item.title] ?? false;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    {item.children ? (
                                        <>
                                            <SidebarMenuButton
                                                onClick={() =>
                                                    toggleMenu(item.title)
                                                }
                                                className={cn(
                                                    'group flex w-full items-center justify-between rounded-lg transition-all duration-200 ease-in-out',
                                                    'hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm',
                                                    'dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10',
                                                    isOpen &&
                                                        'bg-emerald-50 dark:bg-emerald-900/90',
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <item.icon className="h-5 w-5 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:text-emerald-400" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                        {item.title}
                                                    </span>
                                                </span>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 text-slate-400 transition-all duration-200',
                                                        isOpen && 'rotate-180',
                                                        'group-hover:text-emerald-500',
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                            <AnimatePresence initial={false}>
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
                                                        <SidebarMenuSub>
                                                            {item.children.map(
                                                                (child) => (
                                                                    <SidebarMenuSubItem
                                                                        key={
                                                                            child.title
                                                                        }
                                                                    >
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            className="group/sub transition-all duration-200 ease-in-out hover:translate-x-0.5 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/20"
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    child.href
                                                                                }
                                                                                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                                                                            >
                                                                                <span className="ml-2">
                                                                                    {
                                                                                        child.title
                                                                                    }
                                                                                </span>
                                                                                <ArrowRight className="ml-auto h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-all duration-200 group-hover/sub:translate-x-0.5 group-hover/sub:text-emerald-500 group-hover/sub:opacity-100" />
                                                                            </a>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                ),
                                                            )}
                                                        </SidebarMenuSub>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.href ?? '#'}
                                                className="group flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10"
                                            >
                                                <item.icon className="h-5 w-5 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:text-emerald-400" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-3 pb-4">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-white shadow-lg shadow-emerald-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-300 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/50">
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
