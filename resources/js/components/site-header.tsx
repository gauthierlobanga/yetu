// resources/js/components/site-header.tsx
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    Store,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CanRole } from '@/core/permissions/Can';
import SearchInputPage from '@/pages/searchInput';
import AppearanceToogle from './appearance-toogle';
import { ExpandingSearchDock } from './ecommerce/others/ExpandingSearchDock';
import ThemeCustomizer from './Themes/ThemeSettingsSheet';

/**
 * En‑tête principal de l’application.
 * Récupère automatiquement les données partagées par Inertia (auth, tenant, notifications…).
 */
export function SiteHeader() {
    const {
        auth,
        tenant,
        notifications: rawNotifications = [],
    } = usePage().props as any;

    const user = auth?.user;
    const isTenant = Boolean(tenant);

    // Initiales pour l’avatar (fallback)
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    // --- Notifications (exemple statique, à remplacer par des données réelles) ---
    const [notifOpen, setNotifOpen] = useState(false);
    // TODO: remplacer par un appel API ou des props partagées
    const notifications = rawNotifications.length
        ? rawNotifications
        : [
              {
                  id: 1,
                  title: 'Nouvelle commande',
                  message: 'Commande #1234 passée il y a 5 min',
                  read: false,
                  created_at: 'À l’instant',
              },
              {
                  id: 2,
                  title: 'Mise à jour du stock',
                  message: 'Le produit "T-shirt" est en rupture',
                  read: true,
                  created_at: 'Il y a 1 h',
              },
          ];
    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-slate-700 dark:bg-slate-900">
            <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
                {/* Sidebar Trigger */}
                <SidebarTrigger className="-ml-1 h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" />

                <Separator orientation="vertical" className="mx-2 h-4" />

                {/* Lien Dashboard (contexte central ou tenant) */}
                {isTenant && tenant ? (
                    <Link
                        href={tenant.url ?? route('vendor.dashboard')}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
                    >
                        <Store className="h-5 w-5 text-emerald-500" />
                        <span className="hidden md:inline">
                            {tenant.raison_sociale}
                        </span>
                    </Link>
                ) : (
                    <Link
                        href={route('vendor.dashboard')}
                        className="flex items-center gap-2 text-base font-semibold text-slate-800 transition-colors hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
                    >
                        <Menu className="h-5 w-5 text-emerald-500" />
                        <span>Tableau de bord</span>
                    </Link>
                )}

                {/* Barre de recherche (desktop) */}
                <div className="hidden flex-1 justify-center lg:flex">
                    <ExpandingSearchDock />
                </div>

                {/* Actions de droite */}
                <div className="ml-auto flex items-center gap-2">
                    {/* Recherche mobile / fallback */}
                    <div className="lg:hidden">
                        <SearchInputPage />
                    </div>

                    {/* Lien Admin (super_admin) */}
                    <CanRole roles="super_admin">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            asChild
                        >
                            <Link
                                href={route('filament.admin.pages.dashboard')}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Panneau d’administration"
                            >
                                <ShieldCheck className="h-5 w-5" />
                            </Link>
                        </Button>
                    </CanRole>

                    {/* Notifications */}
                    <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                {unreadCount > 0 ? (
                                    <BellRing className="h-5 w-5 text-amber-500" />
                                ) : (
                                    <Bell className="h-5 w-5" />
                                )}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-80 border-slate-200 bg-white p-0 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        {unreadCount} non lues
                                    </span>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                                        Aucune notification
                                    </p>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div
                                            key={notif.id}
                                            className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                                        >
                                            <div
                                                className={`mt-1 h-2 w-2 rounded-full ${
                                                    notif.read
                                                        ? 'bg-transparent'
                                                        : 'bg-emerald-500'
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {notif.message}
                                                </p>
                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    {notif.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Thème clair / sombre */}
                    <AppearanceToogle />

                    {/* Personnalisation du thème (contexte tenant) */}
                    {isTenant && <ThemeCustomizer />}

                    {/* Avatar utilisateur connecté */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm dark:border-slate-700">
                                        <AvatarImage
                                            src={user.avatar_url}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-emerald-100 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 border-slate-200 dark:border-slate-700"
                            >
                                <DropdownMenuLabel className="text-xs text-slate-500">
                                    {user.email}
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('profile.edit')}>
                                            <User className="mr-2 h-4 w-4" />
                                            Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('vendor.configure')}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Paramètres boutique
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                    asChild
                                >
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Déconnexion
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}

// import { Bell, ShieldCheck } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// // resources/js/components/site-header.tsx
// import { Link, usePage } from '@inertiajs/react';
// import {
//     Bell,
//     BellRing,
//     LogOut,
//     Menu,
//     PackagePlus,
//     Settings,
//     ShieldCheck,
//     Store,
//     User,
// } from 'lucide-react';
// import { useState } from 'react';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { toast } from 'sonner';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from '@/components/ui/popover';
// import { Separator } from '@/components/ui/separator';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { CanRole } from '@/core/permissions/Can';
// import SearchInputPage from '@/pages/searchInput';
// import AppearanceToogle from './appearance-toogle';
// import { ExpandingSearchDock } from './ecommerce/others/ExpandingSearchDock';
// import ThemeCustomizer from './Themes/ThemeSettingsSheet';

// export function SiteHeader() {
//     return (
//         <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//             {/* Hero Section moderne */}
//             <div className="flex w-full items-center gap-1 px-4 py-4 lg:gap-2 lg:px-6">
//                 <SidebarTrigger className="-ml-1" />
//         <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-slate-700 dark:bg-slate-900">
//             <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
//                 {/* Sidebar Trigger */}
//                 <SidebarTrigger className="-ml-1 h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" />
//                 {/* <SidebarTrigger className="-ml-1 h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" /> */}
//                 <Separator
//                     orientation="vertical"
//                     className="mx-2 data-[orientation=vertical]:h-4"
//                 />
//                 <Link
//                     href={route('vendor.dashboard')}
//                     className="cursor-pointer text-base font-medium"
//                 >
//                     <h1>Dashboard</h1>
//                 </Link>

//                 {/* Logo / Nom de la boutique (tenant) ou Dashboard (central) */}
//                 {isTenant && tenant ? (
//                     <Link
//                         href={tenant.url}
//                         className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
//                     >
//                         <Store className="h-5 w-5 text-emerald-500" />
//                         <span className="hidden md:inline">
//                             {tenant.raison_sociale}
//                         </span>
//                     </Link>
//                 ) : (
//                     <Link
//                         href={route('vendor.dashboard')}
//                         className="flex items-center gap-2 text-base font-semibold text-slate-800 transition-colors hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
//                     >
//                         <Menu className="h-5 w-5 text-emerald-500" />
//                         <span>Tableau de bord</span>
//                     </Link>
//                 )}

//                 {/* Barre de recherche centrée (visible sur desktop) */}
//                 <ExpandingSearchDock />

//                 {/* Actions de droite */}
//                 <div className="ml-auto flex items-center gap-2">
//                     <SearchInputPage />
//                     <div className="relative flex items-center space-x-1">
//                         <CanRole roles="super_admin">
//                             <div className="relative flex items-center space-x-1 rounded-lg py-2.5">
//                                 <ShieldCheck className="mr-2 h-8 w-8" />
//                                 <Link
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="block w-full cursor-pointer text-sm"
//                                     href={route(
//                                         'filament.admin.pages.dashboard',
//                                     )}
//                                 >
//                                     Admin
//                                 </Link>
//                             </div>
//                         </CanRole>
//                         <Button
//                             variant="ghost"
//                             asChild
//                             className="hidden h-10 w-10 bg-transparent text-amber-500 hover:bg-transparent lg:flex dark:hover:bg-transparent"
//                         >
//                             <Bell className="h-10 w-10 cursor-pointer text-amber-500" />
//                         </Button>
//                         <AppearanceToogle />
//                     </div>

//                     {/* Bouton Admin (super_admin) */}
//                     {user && (
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="relative h-8 w-8 rounded-lg border border-slate-600 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
//                                 >
//                                     <ShieldCheck className="h-5 w-5" />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent
//                                 align="end"
//                                 className="w-48 dark:bg-slate-900"
//                             >
//                                 <DropdownMenuLabel>
//                                     Administration
//                                 </DropdownMenuLabel>
//                                 <DropdownMenuItem asChild>
//                                     <a
//                                         href={route(
//                                             'filament.admin.pages.dashboard',
//                                         )}
//                                         className="cursor-pointer"
//                                     >
//                                         <ShieldCheck className="mr-2 h-4 w-4" />
//                                         Panneau admin
//                                     </a>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem asChild>
//                                     <a
//                                         href={route('vendor.configure')}
//                                         className="cursor-pointer"
//                                     >
//                                         <Settings className="mr-2 h-4 w-4" />
//                                         Paramètres vendeur
//                                     </a>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     )}

//                     {/* Bouton de personnalisation du thème (tenant uniquement) */}
//                     {isTenant && <ThemeCustomizer />}

//                     {/* Notifications */}
//                     <Popover open={notifOpen} onOpenChange={setNotifOpen}>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="relative h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
//                             >
//                                 {unreadCount > 0 ? (
//                                     <BellRing className="h-5 w-5 text-amber-500" />
//                                 ) : (
//                                     <Bell className="h-5 w-5" />
//                                 )}
//                                 {unreadCount > 0 && (
//                                     <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
//                                         {unreadCount}
//                                     </span>
//                                 )}
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent
//                             align="end"
//                             className="w-80 border-slate-200 bg-white p-0 shadow-xl dark:border-slate-700 dark:bg-slate-900"
//                         >
//                             <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
//                                 <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
//                                     Notifications
//                                 </h3>
//                                 {unreadCount > 0 && (
//                                     <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
//                                         {unreadCount} non lues
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="max-h-64 overflow-y-auto">
//                                 {notifications.length === 0 ? (
//                                     <p className="px-4 py-6 text-center text-sm text-slate-500">
//                                         Aucune notification
//                                     </p>
//                                 ) : (
//                                     notifications.map((notif) => (
//                                         <div
//                                             key={notif.id}
//                                             className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
//                                         >
//                                             <div
//                                                 className={`mt-1 h-2 w-2 rounded-full ${
//                                                     notif.read
//                                                         ? 'bg-transparent'
//                                                         : 'bg-emerald-500'
//                                                 }`}
//                                             />
//                                             <div className="flex-1">
//                                                 <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
//                                                     {notif.title}
//                                                 </p>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                                                     {notif.message}
//                                                 </p>
//                                                 <p className="mt-1 text-[10px] text-slate-400">
//                                                     {notif.created_at}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </PopoverContent>
//                     </Popover>

//                     {/* Thème clair/sombre */}
//                     <AppearanceToogle />

//                     {/* Avatar utilisateur */}
//                     {user && (
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="ml-1 h-10 w-10 rounded-full"
//                                 >
//                                     <Avatar className="h-9 w-9 border-2 border-white shadow-sm dark:border-slate-700">
//                                         <AvatarImage
//                                             src={user.avatar_url}
//                                             alt={user.name}
//                                         />
//                                         <AvatarFallback className="bg-emerald-100 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
//                                             {initials}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent
//                                 align="end"
//                                 className="w-56 border-slate-200 dark:border-slate-700"
//                             >
//                                 <DropdownMenuLabel className="text-xs text-slate-500">
//                                     {user.email}
//                                 </DropdownMenuLabel>
//                                 <DropdownMenuGroup>
//                                     <DropdownMenuItem asChild>
//                                         <Link href={route('profile.edit')}>
//                                             <User className="mr-2 h-4 w-4" />
//                                             Profil
//                                         </Link>
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem asChild>
//                                         <Link href={route('vendor.configure')}>
//                                             <Settings className="mr-2 h-4 w-4" />
//                                             Paramètres boutique
//                                         </Link>
//                                     </DropdownMenuItem>
//                                 </DropdownMenuGroup>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem
//                                     className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
//                                     asChild
//                                 >
//                                     <Link
//                                         href={route('logout')}
//                                         method="post"
//                                         as="button"
//                                     >
//                                         <LogOut className="mr-2 h-4 w-4" />
//                                         Déconnexion
//                                     </Link>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }
