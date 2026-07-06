import { Link, usePage } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, Settings, ShieldCheck, User, ShoppingBag } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CanRole } from '@/core/permissions/Can';
import AppearanceToogle from './appearance-toogle';
import { NotificationsDropdown } from './layouts/header/NotificationsDropdown';
import ShopThemeCustomizer from './Themes/ShopThemeCustomizer';

export function SiteHeader({ context = 'vendor' }: { context?: 'vendor' | 'buyer' }) {
    const {
        auth,
        tenant,
        // notifications: serverNotifications = [],
    } = usePage().props as any;

    const user = auth?.user;
    const isTenant = Boolean(tenant);

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((namePart: string) => namePart[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-slate-800/70 dark:bg-slate-950/80">
            <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
                <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" />

                <Separator orientation="vertical" className="mx-2 h-5 bg-slate-200 dark:bg-slate-700" />

                {/* Modern Context Indicator */}
                <div className="flex items-center gap-3">
                    {context === 'vendor' && isTenant && tenant ? (
                        <Link href={tenant.url ?? route('vendor.dashboard')} className="group flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 shadow-xs ring-1 ring-emerald-200/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-emerald-800/50 dark:group-hover:bg-emerald-900/60">
                                <Menu className="h-4 w-4" />
                            </div>
                            <div className="hidden flex-col md:flex">
                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Espace Vendeur
                                </span>
                                <span className="text-sm font-bold tracking-tight text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                    {tenant.raison_sociale}
                                </span>
                            </div>
                        </Link>
                    ) : context === 'buyer' ? (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/80 text-blue-700 shadow-xs ring-1 ring-blue-200/50 dark:bg-blue-900/40 dark:text-blue-400 dark:ring-blue-800/50">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <div className="hidden flex-col md:flex">
                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Espace Client
                                </span>
                                <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                                    Mes achats
                                </span>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={route('vendor.dashboard')}
                            className="group flex items-center gap-3"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-xs ring-1 ring-slate-200/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700/50">
                                <Menu className="h-4 w-4" />
                            </div>
                            <div className="hidden flex-col md:flex">
                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Menu Principal
                                </span>
                                <span className="text-sm font-bold tracking-tight text-slate-800 transition-colors group-hover:text-slate-900 dark:text-slate-100 dark:group-hover:text-white">
                                    Tableau de bord
                                </span>
                            </div>
                        </Link>
                    )}
                </div>

                <div className="hidden flex-1 justify-center lg:flex">
                    {/* <DropdownSearchExperience /> */}
                    {/* <ExpandingSearchDock /> */}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="lg:hidden">
                        {/* <ExpandingSearchDock /> */}
                        {/* <DropdownSearchExperience /> */}
                    </div>

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
                                title="Panneau d'administration"
                            >
                                <ShieldCheck className="h-5 w-5" />
                            </Link>
                        </Button>
                    </CanRole>

                    <NotificationsDropdown />

                    <AppearanceToogle />

                    {isTenant && <ShopThemeCustomizer />}

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
                                        <Link
                                            href={
                                                isTenant
                                                    ? route(
                                                          'tenant.profile.edit',
                                                      )
                                                    : route('profile.edit')
                                            }
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    {isTenant && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('vendor.configure')}
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                Paramètres boutique
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
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
