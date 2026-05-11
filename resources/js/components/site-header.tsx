// resources/js/components/site-header.tsx
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    LogOut,
    Menu,
    PackagePlus,
    Search,
    Settings,
    ShieldCheck,
    Store,
    User,
} from 'lucide-react';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AppearanceToogle from './appearance-toogle';

// ----- Types (à adapter à votre backend) -----
interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
}
interface NotificationItem {
    id: number;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}
// ---------------------------------------------

export function SiteHeader() {
    const { props } = usePage<{
        auth: { user: AuthUser | null };
        notifications?: NotificationItem[];
        isTenant?: boolean;
        tenant?: { admin_url: string; url: string; raison_sociale: string };
    }>();

    const user = props.auth?.user;
    const notifications = props.notifications ?? [];
    const unreadCount = notifications.filter((n) => !n.read).length;
    const isTenant = props.isTenant;
    const tenant = props.tenant;

    // ----- Notification Popover state -----
    const [notifOpen, setNotifOpen] = useState(false);

    // ----- Avatar fallback -----
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
        : '?';

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
                {/* Sidebar Trigger */}
                <SidebarTrigger className="-ml-1 h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" />
                <Separator
                    orientation="vertical"
                    className="mx-1 h-6 bg-slate-200 dark:bg-slate-700"
                />

                {/* Logo / Nom de la boutique (tenant) ou Dashboard (central) */}
                {isTenant && tenant ? (
                    <Link
                        href={tenant.url}
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

                {/* Barre de recherche centrée (visible sur desktop) */}
                <div className="mx-auto hidden max-w-md flex-1 lg:flex">
                    <div className="relative w-full">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Rechercher..."
                            className="h-10 rounded-full border-slate-200 bg-slate-50 pr-4 pl-10 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                            // Vous pouvez connecter cette recherche à votre logique
                        />
                    </div>
                </div>

                {/* Actions de droite */}
                <div className="ml-auto flex items-center gap-2">
                    {/* Bouton Nouveau Produit (tenant uniquement) */}
                    {isTenant && tenant && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hidden border-emerald-300 text-emerald-700 hover:bg-emerald-50 md:inline-flex dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        >
                            <a href={`${tenant.admin_url}/produits/create`}>
                                <PackagePlus className="mr-2 h-4 w-4" />
                                Nouveau produit
                            </a>
                        </Button>
                    )}

                    {/* Bouton Admin (super_admin) */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                    Administration
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={route(
                                            'filament.admin.pages.dashboard',
                                        )}
                                        className="cursor-pointer"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Panneau admin
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={route('vendor.configure')}
                                        className="cursor-pointer"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Paramètres vendeur
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

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
                                    notifications.map((notif) => (
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

                    {/* Thème clair/sombre */}
                    <AppearanceToogle />

                    {/* Avatar utilisateur */}
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
