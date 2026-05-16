/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Link } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     LayoutDashboard,
//     Package,
//     ShoppingCart,
//     BarChart3,
//     Settings,
//     ChevronDown,
//     Tag,
//     Warehouse,
//     Users,
//     Rocket,
//     Sparkles,
//     ArrowRight,
//     BookOpen,
//     ShoppingBag,
// } from 'lucide-react';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     useSidebar,
// } from '@/components/ui/sidebar';
// import { cn } from '@/lib/utils';
// import type { Tenant } from '@/types/tenants/products/vendor/tenant';

// export function VendorSidebar({ tenant }: { tenant: Tenant }) {
//     const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
//     const { state } = useSidebar();
//     const isCollapsed = state === 'collapsed';

//     const toggleMenu = (title: string) => {
//         setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
//     };

//     const navigation = [
//         {
//             title: 'Accueil',
//             icon: LayoutDashboard,
//             href: route('vendor.dashboard'),
//         },
//         {
//             title: 'Produits',
//             icon: Package,
//             children: [
//                 {
//                     title: 'Tous les produits',
//                     href: route('dashboard.products.index'),
//                 },
//                 {
//                     title: 'Catégories',
//                     href: `${tenant.admin_url}/products/product-categories`,
//                 },
//                 {
//                     title: 'Promotions',
//                     href: `${tenant.admin_url}/promotions/promotions`,
//                 },
//                 {
//                     title: 'Fournisseurs',
//                     href: `${tenant.admin_url}/fournisseurs`,
//                 },
//                 {
//                     title: 'Variantes',
//                     href: `${tenant.admin_url}/products/variante-produits`,
//                 },
//                 {
//                     title: 'Marques',
//                     href: `${tenant.admin_url}/products/brands`,
//                 },
//             ],
//         },
//         {
//             title: 'Commandes',
//             icon: ShoppingCart,
//             children: [
//                 {
//                     title: 'Commandes clients',
//                     href: `${tenant.admin_url}/commandes/commandes`,
//                 },
//                 {
//                     title: 'Lignes de commande',
//                     href: `${tenant.admin_url}/ligne-commandes`,
//                 },
//                 {
//                     title: 'Commandes achat',
//                     href: `${tenant.admin_url}/commandes-achat`,
//                 },
//                 {
//                     title: 'Retours',
//                     href: `${tenant.admin_url}/commandes/retours`,
//                 },
//                 {
//                     title: 'Paniers',
//                     href: `${tenant.admin_url}/paniers/paniers`,
//                 },
//             ],
//         },
//         {
//             title: 'Marketing',
//             icon: Tag,
//             children: [
//                 {
//                     title: 'Promotions',
//                     href: `${tenant.admin_url}/promotions/promotions`,
//                 },
//                 {
//                     title: 'Coupons',
//                     href: `${tenant.admin_url}/inventor/coupons`,
//                 },
//                 {
//                     title: 'Wishlist',
//                     href: `${tenant.admin_url}/wishlists/wishlists`,
//                 },
//             ],
//         },
//         {
//             title: 'Blog',
//             icon: BookOpen,
//             children: [
//                 { title: 'Tableau de bord', href: route('profile.destroy') },
//                 { title: 'Posts', href: `${tenant.admin_url}/posts/posts` },
//                 {
//                     title: 'Catégories',
//                     href: `${tenant.admin_url}/posts/categories`,
//                 },
//             ],
//         },
//         {
//             title: 'Inventaire',
//             icon: Warehouse,
//             children: [
//                 {
//                     title: 'Stock',
//                     href: `${tenant.admin_url}/inventor/mouvement-stocks`,
//                 },
//                 {
//                     title: 'Inventaires',
//                     href: `${tenant.admin_url}/inventor/inventaires`,
//                 },
//                 {
//                     title: 'Entrepôts',
//                     href: `${tenant.admin_url}/inventor/entrepots`,
//                 },
//             ],
//         },
//         {
//             title: 'Clients',
//             icon: Users,
//             children: [
//                 { title: 'Clients', href: `${tenant.admin_url}/clients` },
//                 { title: 'Adresses', href: `${tenant.admin_url}/adresses` },
//             ],
//         },
//         {
//             title: 'Statistiques',
//             icon: BarChart3,
//             href: route('vendor.statistics'),
//         },
//         {
//             title: 'Paramètres',
//             icon: Settings,
//             href: route('vendor.settings'),
//         },
//         {
//             title: 'Profile',
//             icon: Settings,
//             href: route('profile.destroy'),
//         },
//     ];

//     return (
//         <Sidebar
//             collapsible="icon"
//             variant="inset"
//             className="bg-white/80 backdrop-blur-xl dark:border-emerald-900/30 dark:bg-slate-900"
//         >
//             <SidebarHeader className="flex items-center gap-2 px-4 py-4 dark:bg-slate-900">
//                 {tenant.logo_url ? (
//                     <img
//                         src={tenant.logo_url}
//                         alt={tenant.raison_sociale}
//                         className="h-10 w-10 rounded-lg object-cover shadow-sm"
//                     />
//                 ) : (
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
//                         <ShoppingBag className="h-8 w-8" />
//                     </div>
//                 )}
//                 <div className="min-w-0 group-data-[collapsible=icon]:hidden">
//                     <p className="truncate text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
//                         {tenant.raison_sociale}
//                     </p>
//                 </div>
//             </SidebarHeader>

//             <SidebarContent className="px-2 dark:bg-slate-900">
//                 <SidebarGroup>
//                     <SidebarMenu>
//                         {navigation.map((item) => {
//                             const isOpen = openMenus[item.title] ?? false;

//                             if (item.children) {
//                                 return (
//                                     <SidebarMenuItem key={item.title}>
//                                         {isCollapsed ? (
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <SidebarMenuButton
//                                                         tooltip={item.title}
//                                                         className="group flex w-full items-center justify-between rounded-lg transition-all duration-200 ease-in-out hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20"
//                                                     >
//                                                         <item.icon className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-300" />
//                                                     </SidebarMenuButton>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent
//                                                     align="start"
//                                                     side="right"
//                                                     className="w-48 border-slate-200 dark:border-slate-700"
//                                                 >
//                                                     {item.children.map(
//                                                         (child) => (
//                                                             <DropdownMenuItem
//                                                                 key={
//                                                                     child.title
//                                                                 }
//                                                                 asChild
//                                                             >
//                                                                 <a
//                                                                     href={
//                                                                         child.href
//                                                                     }
//                                                                     className="cursor-pointer"
//                                                                 >
//                                                                     {
//                                                                         child.title
//                                                                     }
//                                                                 </a>
//                                                             </DropdownMenuItem>
//                                                         ),
//                                                     )}
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         ) : (
//                                             <>
//                                                 <SidebarMenuButton
//                                                     onClick={() =>
//                                                         toggleMenu(item.title)
//                                                     }
//                                                     className={cn(
//                                                         'group flex w-full items-center justify-between rounded-lg transition-all duration-200',
//                                                         'hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm',
//                                                         'dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10',
//                                                         isOpen &&
//                                                             'bg-emerald-50 dark:bg-emerald-900/90',
//                                                     )}
//                                                 >
//                                                     <span className="flex items-center gap-3">
//                                                         <item.icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
//                                                         <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
//                                                             {item.title}
//                                                         </span>
//                                                     </span>
//                                                     <ChevronDown
//                                                         className={cn(
//                                                             'h-4 w-4 text-slate-400 transition-all',
//                                                             isOpen &&
//                                                                 'rotate-180',
//                                                             'group-hover:text-emerald-500 dark:group-hover:text-emerald-300',
//                                                         )}
//                                                     />
//                                                 </SidebarMenuButton>

//                                                 <AnimatePresence
//                                                     initial={false}
//                                                 >
//                                                     {isOpen && (
//                                                         <motion.div
//                                                             key="content"
//                                                             initial={{
//                                                                 height: 0,
//                                                                 opacity: 0,
//                                                             }}
//                                                             animate={{
//                                                                 height: 'auto',
//                                                                 opacity: 1,
//                                                             }}
//                                                             exit={{
//                                                                 height: 0,
//                                                                 opacity: 0,
//                                                             }}
//                                                             transition={{
//                                                                 duration: 0.2,
//                                                                 ease: 'easeInOut',
//                                                             }}
//                                                             className="overflow-hidden"
//                                                         >
//                                                             <div className="mx-2 mt-1 mb-2 rounded-xl border border-emerald-100 bg-emerald-50/30 p-2 shadow-sm backdrop-blur-sm dark:border-emerald-900/30 dark:bg-emerald-900/20">
//                                                                 {item.children.map(
//                                                                     (child) => (
//                                                                         <a
//                                                                             key={
//                                                                                 child.title
//                                                                             }
//                                                                             href={
//                                                                                 child.href
//                                                                             }
//                                                                             className="group/sub flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/80 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-emerald-300"
//                                                                         >
//                                                                             <span className="flex-1">
//                                                                                 {
//                                                                                     child.title
//                                                                                 }
//                                                                             </span>
//                                                                             <ArrowRight className="h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-all group-hover/sub:translate-x-0.5 group-hover/sub:text-emerald-500 group-hover/sub:opacity-100 dark:group-hover/sub:text-emerald-300" />
//                                                                         </a>
//                                                                     ),
//                                                                 )}
//                                                             </div>
//                                                         </motion.div>
//                                                     )}
//                                                 </AnimatePresence>
//                                             </>
//                                         )}
//                                     </SidebarMenuItem>
//                                 );
//                             }

//                             // Élément simple
//                             return (
//                                 // Élément simple dans la navigation
//                                 <SidebarMenuItem key={item.title}>
//                                     <SidebarMenuButton
//                                         asChild
//                                         tooltip={
//                                             isCollapsed ? item.title : undefined
//                                         }
//                                     >
//                                         <Link
//                                             href={item.href ?? '#'}
//                                             className="group flex items-center gap-3 rounded-lg transition-all duration-200 hover:translate-x-0.5 hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20 dark:hover:shadow-emerald-900/10"
//                                         >
//                                             <item.icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
//                                             {!isCollapsed && (
//                                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
//                                                     {item.title}
//                                                 </span>
//                                             )}
//                                         </Link>
//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             );
//                         })}
//                     </SidebarMenu>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter className="px-3 pb-4 group-data-[collapsible=icon]:hidden dark:bg-slate-900">
//                 <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-4 text-white shadow-lg shadow-emerald-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-300 dark:from-emerald-600 dark:to-emerald-800 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/50">
//                     <div className="mb-2 flex items-center gap-2">
//                         <Rocket className="h-5 w-5" />
//                         <span className="text-sm font-semibold">
//                             {tenant.plan?.name ?? 'Plan Gratuit'}
//                         </span>
//                     </div>
//                     <p className="mb-3 text-xs text-emerald-100">
//                         Passez à un plan supérieur pour débloquer plus de
//                         fonctionnalités.
//                     </p>
//                     <Button
//                         asChild
//                         size="sm"
//                         className="w-full rounded-xl bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/30"
//                     >
//                         <Link href={route('vendor.payment')}>
//                             <Sparkles className="mr-2 h-4 w-4" />
//                             Changer de plan
//                             <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
//                         </Link>
//                     </Button>
//                 </div>
//             </SidebarFooter>
//         </Sidebar>
//     );
// }
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
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
    Crown,
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
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
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
                {
                    title: 'Posts',
                    href: `${tenant.admin_url}/posts/posts`,
                },
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
                {
                    title: 'Clients',
                    href: `${tenant.admin_url}/clients`,
                },
                {
                    title: 'Adresses',
                    href: `${tenant.admin_url}/adresses`,
                },
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
            title: 'Profil',
            icon: Settings,
            href: route('profile.destroy'),
        },
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            // className="bg-white/80 backdrop-blur-xl dark:border-emerald-900/30 dark:bg-slate-900"
            className={cn(
                // Base
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-[backdrop-filter]:bg-white/88',

                // Dark mode
                'dark:border-slate-800/80',
                'dark:bg-slate-950/94 dark:supports-[backdrop-filter]:bg-slate-950/88',

                // Ombre très subtile
                'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.04)]',
                'dark:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_20px_40px_rgba(0,0,0,0.25)]',
            )}
        >
            {/* Halo décoratif */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Halo supérieur emerald */}
                <div className="absolute top-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-400/6" />

                {/* Halo latéral slate */}
                <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-slate-400/8 blur-3xl dark:bg-slate-500/6" />

                {/* Lueur bas */}
                <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-emerald-500/[0.03] to-transparent dark:from-emerald-400/[0.02]" />
            </div>

            {/* ============= HEADER ============== */}
            <SidebarHeader className="relative border-b border-slate-200/60 px-3 px-4 py-4 dark:border-slate-800/70 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    {tenant.logo_url ? (
                        <img
                            src={tenant.logo_url}
                            alt={tenant.raison_sociale}
                            className={cn(
                                'h-11 w-11 rounded-2xl object-cover',
                                'border border-white/80 dark:border-slate-700/70',
                                'shadow-[0_8px_24px_rgba(16,185,129,0.12)]',
                            )}
                        />
                    ) : (
                        <div
                            className={cn(
                                'relative flex h-11 w-11 items-center justify-center rounded-2xl',
                                'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
                                'text-white',
                                'shadow-[0_10px_30px_rgba(16,185,129,0.25)]',
                            )}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-white/10" />
                            <ShoppingBag className="relative h-5 w-5" />
                        </div>
                    )}

                    <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                        <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            {tenant.raison_sociale}
                        </p>
                        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                            Tableau vendeur
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            {/* ============ CONTENT ============== */}
            <SidebarContent className="px-2 py-3 dark:bg-slate-900">
                <SidebarGroup>
                    <SidebarMenu className="space-y-1">
                        {navigation.map((item) => {
                            const isOpen = openMenus[item.title] ?? false;

                            /* ======================================
                               GROUP WITH CHILDREN
                            ====================================== */
                            if (item.children) {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {isCollapsed ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className="h-11 rounded-xl"
                                                    >
                                                        <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                    </SidebarMenuButton>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    side="right"
                                                    align="start"
                                                    className="w-56 rounded-xl border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95"
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
                                                {/* Parent item (NO animation on title) */}
                                                <SidebarMenuButton
                                                    onClick={() =>
                                                        toggleMenu(item.title)
                                                    }
                                                    className={cn(
                                                        'h-11 rounded-xl px-3',
                                                        'hover:bg-slate-100 dark:hover:bg-slate-800/60',
                                                        isOpen &&
                                                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
                                                    )}
                                                >
                                                    <div className="flex w-full items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            <span className="text-sm font-medium">
                                                                {item.title}
                                                            </span>
                                                        </div>

                                                        <ChevronDown
                                                            className={cn(
                                                                'h-4 w-4 text-slate-400 transition-transform duration-200',
                                                                isOpen &&
                                                                    'rotate-180',
                                                            )}
                                                        />
                                                    </div>
                                                </SidebarMenuButton>

                                                {/* Children with animation */}
                                                <AnimatePresence
                                                    initial={false}
                                                >
                                                    {isOpen && (
                                                        <motion.div
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
                                                                duration: 0.22,
                                                                ease: 'easeOut',
                                                            }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="relative mt-1 ml-5 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-800">
                                                                {item.children.map(
                                                                    (
                                                                        child,
                                                                        index,
                                                                    ) => (
                                                                        <motion.a
                                                                            key={
                                                                                child.title
                                                                            }
                                                                            href={
                                                                                child.href
                                                                            }
                                                                            initial={{
                                                                                opacity: 0,
                                                                                x: -8,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                x: 0,
                                                                            }}
                                                                            transition={{
                                                                                delay:
                                                                                    index *
                                                                                    0.03,
                                                                                duration: 0.18,
                                                                            }}
                                                                            className={cn(
                                                                                'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                                                                                'text-slate-600 hover:bg-slate-100 hover:text-emerald-700',
                                                                                'dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-emerald-300',
                                                                            )}
                                                                        >
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-500 dark:bg-slate-600" />

                                                                            <span className="flex-1 truncate">
                                                                                {
                                                                                    child.title
                                                                                }
                                                                            </span>

                                                                            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                                                        </motion.a>
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

                            /* ======================================
                               SIMPLE ITEM
                            ====================================== */
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={
                                            isCollapsed ? item.title : undefined
                                        }
                                        className="h-11 rounded-xl px-3"
                                    >
                                        <Link
                                            href={item.href ?? '#'}
                                            className={cn(
                                                'group flex items-center gap-3',
                                                'text-slate-700 dark:text-slate-200',
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                                            {!isCollapsed && (
                                                <>
                                                    <span className="flex-1 text-sm font-medium">
                                                        {item.title}
                                                    </span>

                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                                </>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* ================ FOOTER PREMIUM ============================ */}
            <SidebarFooter className="relative p-3 group-data-[collapsible=icon]:hidden">
                <div
                    className={cn(
                        'relative overflow-hidden rounded-3xl',
                        'border border-emerald-400/20',
                        'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
                        'p-4 text-white',
                        'shadow-[0_20px_40px_rgba(16,185,129,0.22)]',
                    )}
                >
                    {/* Glow décoratif */}
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-black/10 blur-2xl" />

                    <div className="relative">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                                <Crown className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {tenant.plan?.name ?? 'Plan Gratuit'}
                                </p>
                                <p className="text-xs text-emerald-50/85">
                                    Débloquez plus de fonctionnalités
                                </p>
                            </div>
                        </div>

                        <Button
                            asChild
                            size="sm"
                            className={cn(
                                'h-10 w-full rounded-2xl',
                                'border-0 bg-white/15 text-white',
                                'ring-1 ring-white/15 backdrop-blur-sm',
                                'hover:bg-white/20',
                                'shadow-none',
                            )}
                        >
                            <Link href={route('vendor.payment')}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Changer de plan
                            </Link>
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
