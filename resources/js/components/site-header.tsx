import { Link, router, usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
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
import { useEffect, useMemo, useState } from 'react';
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

type DashboardNotification = {
    id: string;
    type: string;
    title: string;
    message: string;
    url: string | null;
    read_at: string | null;
    created_at: string;
    data?: Record<string, unknown>;
    isRealtime?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const stringValue = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim() !== '' ? value : fallback;

const nullableStringValue = (value: unknown): string | null =>
    typeof value === 'string' && value.trim() !== '' ? value : null;

function normalizeNotification(
    value: unknown,
    fallbackCreatedAt = new Date().toISOString(),
): DashboardNotification | null {
    if (!isRecord(value)) {
        return null;
    }

    const data = isRecord(value.data) ? value.data : {};
    const id =
        value.id ??
        data.id ??
        `realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const title = stringValue(
        value.title,
        stringValue(
            data.title,
            stringValue(
                value.body,
                stringValue(
                    data.body,
                    stringValue(data.message, 'Notification'),
                ),
            ),
        ),
    );
    const message = stringValue(
        value.message,
        stringValue(
            data.message,
            stringValue(value.body, stringValue(data.body)),
        ),
    );
    const createdAt = stringValue(
        value.created_at,
        stringValue(
            data.created_at,
            stringValue(data.occurred_at, fallbackCreatedAt),
        ),
    );

    return {
        id: String(id),
        type: stringValue(value.type, stringValue(data.type, 'system')),
        title,
        message,
        url: nullableStringValue(value.url ?? data.url),
        read_at: nullableStringValue(value.read_at ?? data.read_at),
        created_at: createdAt,
        data: { ...data, ...value },
    };
}

function formatNotificationDate(value: string | null): string {
    if (!value) {
        return 'Maintenant';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Maintenant';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export function SiteHeader() {
    const {
        auth,
        tenant,
        notifications: serverNotifications = [],
    } = usePage().props as any;

    const user = auth?.user;
    const isTenant = Boolean(tenant);
    const tenantId = tenant?.id ? String(tenant.id) : null;
    const [notifOpen, setNotifOpen] = useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState<
        DashboardNotification[]
    >([]);
    const [localReadAt, setLocalReadAt] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!user?.id || !tenantId || typeof window === 'undefined') {
            return;
        }

        const echoInstance = window.Echo ?? echo();
        window.Echo = echoInstance;

        const channelName = `tenant.${tenantId}.users.${user.id}`;
        const channel = echoInstance.private(channelName);

        const handleNotification = (payload: unknown) => {
            const notification = normalizeNotification(payload);

            if (!notification) {
                return;
            }

            const realtimeNotification = {
                ...notification,
                read_at: null,
                isRealtime: true,
            };

            setRealtimeNotifications((previous) =>
                [
                    realtimeNotification,
                    ...previous.filter(
                        (item) => item.id !== realtimeNotification.id,
                    ),
                ].slice(0, 50),
            );

            toast(realtimeNotification.title, {
                description: realtimeNotification.message || undefined,
            });
        };

        channel.notification(handleNotification);

        return () => {
            channel.stopListeningForNotification(handleNotification);
            echoInstance.leave(channelName);
        };
    }, [tenantId, user?.id]);

    const allNotifications = useMemo(() => {
        const server = Array.isArray(serverNotifications)
            ? serverNotifications
                  .map((notification: unknown) =>
                      normalizeNotification(notification),
                  )
                  .filter(
                      (
                          notification: DashboardNotification | null,
                      ): notification is DashboardNotification =>
                          notification !== null,
                  )
            : [];

        const existingIds = new Set(
            server.map((notification) => notification.id),
        );
        const realtimeOnly = realtimeNotifications.filter(
            (notification) => !existingIds.has(notification.id),
        );

        return [...realtimeOnly, ...server].map((notification) => ({
            ...notification,
            read_at: localReadAt[notification.id] ?? notification.read_at,
        }));
    }, [serverNotifications, realtimeNotifications, localReadAt]);

    const unreadCount = allNotifications.filter(
        (notification) => !notification.read_at,
    ).length;

    const markAsRead = (id: string) => {
        const readAt = new Date().toISOString();

        setLocalReadAt((previous) => ({
            ...previous,
            [id]: readAt,
        }));

        setRealtimeNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, read_at: readAt }
                    : notification,
            ),
        );

        router.post(
            route('tenant.notifications.mark-as-read', { id }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const markAllAsRead = () => {
        const readAt = new Date().toISOString();

        setLocalReadAt((previous) => ({
            ...previous,
            ...Object.fromEntries(
                allNotifications.map((notification) => [
                    notification.id,
                    readAt,
                ]),
            ),
        }));

        setRealtimeNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read_at: readAt,
            })),
        );

        router.post(
            route('tenant.notifications.mark-all-as-read'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((namePart: string) => namePart[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-slate-700 dark:bg-slate-900">
            <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
                <SidebarTrigger className="-ml-1 h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" />

                <Separator orientation="vertical" className="mx-2 h-4" />

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

                <div className="hidden flex-1 justify-center lg:flex">
                    <ExpandingSearchDock />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="lg:hidden">
                        <SearchInputPage />
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
                    {/*
                    <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-10 w-10 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                aria-label="Notifications"
                            >
                                {unreadCount > 0 ? (
                                    <BellRing className="h-5 w-5 text-amber-500" />
                                ) : (
                                    <Bell className="h-5 w-5" />
                                )}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {unreadCount > 99 ? '99+' : unreadCount}
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
                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        Tout lu
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {allNotifications.length === 0 ? (
                                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                                        Aucune notification
                                    </p>
                                ) : (
                                    allNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                                                !notification.read_at
                                                    ? 'bg-emerald-50/40 dark:bg-emerald-900/10'
                                                    : ''
                                            }`}
                                        >
                                            <span
                                                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                                                    notification.read_at
                                                        ? 'bg-transparent'
                                                        : 'bg-emerald-500'
                                                }`}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {notification.title}
                                                </p>
                                                {notification.message && (
                                                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                        {notification.message}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-center gap-2">
                                                    <p className="text-[10px] text-slate-400">
                                                        {formatNotificationDate(
                                                            notification.created_at,
                                                        )}
                                                    </p>
                                                    {!notification.read_at && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id,
                                                                )
                                                            }
                                                            className="text-[10px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                                        >
                                                            Marquer lu
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover> */}
                    {/* Notifications Center */}
                    <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Notifications ${
                                    unreadCount > 0
                                        ? `(${unreadCount} non lues)`
                                        : ''
                                }`}
                                className={`relative h-10 w-10 rounded-2xl border transition-all duration-300 ${
                                    unreadCount > 0
                                        ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 text-amber-600 shadow-[0_8px_30px_rgba(251,191,36,0.18)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(251,191,36,0.28)] dark:border-amber-500/20 dark:from-amber-500/10 dark:via-slate-900 dark:to-orange-500/10 dark:text-amber-400'
                                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                                } `}
                            >
                                {/* Halo animé */}
                                {unreadCount > 0 && (
                                    <>
                                        <span className="absolute inset-0 animate-ping rounded-2xl bg-amber-400/20" />
                                        <span className="absolute inset-0 animate-pulse rounded-2xl ring-2 ring-amber-400/30" />
                                    </>
                                )}

                                {/* Icône */}
                                <span className="relative z-10">
                                    {unreadCount > 0 ? (
                                        <BellRing className="h-5 w-5 animate-[swing_2.5s_ease-in-out_infinite]" />
                                    ) : (
                                        <Bell className="h-5 w-5" />
                                    )}
                                </span>

                                {/* Badge compteur */}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-1 text-[10px] font-bold text-white shadow-lg ring-2 ring-white dark:ring-slate-900">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}

                                {/* Petit point de présence */}
                                {unreadCount > 0 && (
                                    <span className="absolute right-1 bottom-1 z-10 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                                )}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            align="end"
                            sideOffset={12}
                            className="w-[390px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/95"
                        >
                            {/* Header */}
                            <div className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-violet-500/5" />

                                <div className="relative flex items-center justify-between px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg">
                                            <BellRing className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Notifications
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {unreadCount > 0
                                                    ? `${unreadCount} non lue${
                                                          unreadCount > 1
                                                              ? 's'
                                                              : ''
                                                      }`
                                                    : 'Tout est à jour'}
                                            </p>
                                        </div>
                                    </div>

                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="h-8 rounded-xl px-3 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                                        >
                                            Tout lire
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Liste */}
                            <div className="max-h-[420px] overflow-y-auto">
                                {allNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                            <Bell className="h-7 w-7 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            Aucune notification
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Vous êtes parfaitement à jour.
                                        </p>
                                    </div>
                                ) : (
                                    allNotifications.map((notification) => {
                                        const isUnread = !notification.read_at;

                                        return (
                                            <button
                                                key={notification.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isUnread) {
                                                        markAsRead(
                                                            notification.id,
                                                        );
                                                    }

                                                    if (notification.url) {
                                                        setNotifOpen(false);
                                                        router.visit(
                                                            notification.url,
                                                        );
                                                    }
                                                }}
                                                className={`group relative w-full border-b border-slate-100 px-5 py-4 text-left transition-all duration-200 dark:border-slate-800 ${
                                                    isUnread
                                                        ? 'bg-gradient-to-r from-emerald-50/70 to-transparent hover:from-emerald-50 dark:from-emerald-500/5'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                                } `}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Indicateur */}
                                                    <div className="relative mt-1 shrink-0">
                                                        <div
                                                            className={`h-2.5 w-2.5 rounded-full ${
                                                                isUnread
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-300 dark:bg-slate-600'
                                                            } `}
                                                        />
                                                        {isUnread && (
                                                            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                                                        )}
                                                    </div>

                                                    {/* Contenu */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p
                                                                className={`truncate text-sm ${
                                                                    isUnread
                                                                        ? 'font-semibold text-slate-900 dark:text-white'
                                                                        : 'font-medium text-slate-700 dark:text-slate-200'
                                                                } `}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>

                                                            {notification.isRealtime && (
                                                                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-500/10 dark:text-emerald-400">
                                                                    Live
                                                                </span>
                                                            )}
                                                        </div>

                                                        {notification.message && (
                                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                        )}

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                                {formatNotificationDate(
                                                                    notification.created_at,
                                                                )}
                                                            </span>

                                                            {isUnread && (
                                                                <span className="text-[11px] font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
                                                                    Marquer
                                                                    comme lu
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            {allNotifications.length > 0 && (
                                <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                                    <Button
                                        variant="ghost"
                                        className="h-9 w-full rounded-xl text-xs font-medium text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
                                        onClick={() => {
                                            setNotifOpen(false);
                                            router.visit(
                                                route(
                                                    'tenant.notifications.index',
                                                ),
                                            );
                                        }}
                                    >
                                        Voir toutes les notifications
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>

                    <AppearanceToogle />

                    {isTenant && <ThemeCustomizer />}

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
