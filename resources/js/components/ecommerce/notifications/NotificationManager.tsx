/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Link, router } from '@inertiajs/react';
// import { formatDistanceToNow } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//     Bell,
//     Check,
//     CheckCheck,
//     CreditCard,
//     Gift,
//     Heart,
//     Info,
//     MessageCircle,
//     Package,
//     Star,
//     Tag,
//     Trash2,
//     ChevronRight,
// } from 'lucide-react';
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { getToastStyles } from '@/lib/toast-style';
// import { cn } from '@/lib/utils';
// import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

// interface PaginatedNotifications {
//     data: DashboardNotification[];
//     current_page: number;
//     last_page: number;
//     total: number;
//     links: { url: string | null; label: string; active: boolean }[];
// }

// interface NotificationManagerProps {
//     notifications: PaginatedNotifications;
//     activeTab: 'all' | 'unread';
//     /** Route name for the notification detail page */
//     detailRouteName?: string;
// }

// const getIconForType = (type: string) => {
//     switch (type) {
//         case 'order':
//             return <Package className="h-5 w-5" />;
//         case 'payment':
//         case 'success':
//             return <CreditCard className="h-5 w-5" />;
//         case 'message':
//             return <MessageCircle className="h-5 w-5" />;
//         case 'review':
//             return <Star className="h-5 w-5" />;
//         case 'promotion':
//             return <Tag className="h-5 w-5" />;
//         case 'loyalty':
//             return <Gift className="h-5 w-5" />;
//         case 'wishlist':
//             return <Heart className="h-5 w-5" />;
//         case 'error':
//             return <Info className="h-5 w-5" />;
//         default:
//             return <Bell className="h-5 w-5" />;
//     }
// };

// const getColorForType = (type: string) => {
//     switch (type) {
//         case 'order':
//             return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
//         case 'payment':
//         case 'success':
//             return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
//         case 'promotion':
//             return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800';
//         case 'loyalty':
//             return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
//         case 'wishlist':
//             return 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800';
//         case 'error':
//             return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800';
//         case 'message':
//             return 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800';
//         case 'review':
//             return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800';
//         default:
//             return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
//     }
// };

// export function NotificationManager({
//     notifications,
//     activeTab,
//     detailRouteName,
// }: NotificationManagerProps) {
//     const [isLoading, setIsLoading] = useState(false);

//     const unreadCount = notifications.data.filter((n) => !n.read_at).length;

//     const handleTabChange = (value: string) => {
//         setIsLoading(true);
//         router.get(
//             window.location.pathname,
//             { tab: value },
//             {
//                 preserveState: true,
//                 preserveScroll: true,
//                 showProgress: false,
//                 onFinish: () => setIsLoading(false),
//             },
//         );
//     };

//     const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         e.preventDefault();
//         router.post(
//             route('tenant.notifications.mark-as-read', id),
//             {},
//             { preserveScroll: true, preserveState: true, showProgress: false },
//         );
//     };

//     const handleMarkAllAsRead = () => {
//         router.post(
//             route('tenant.notifications.mark-all-as-read'),
//             {},
//             {
//                 preserveScroll: true,
//                 showProgress: false,
//                 onSuccess: () =>
//                     toast.success(
//                         'Toutes les notifications ont été marquées comme lues.',
//                         {
//                             style: getToastStyles(),
//                         },
//                     ),
//             },
//         );
//     };

//     const handleDelete = (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         e.preventDefault();
//         router.delete(route('tenant.notifications.destroy', id), {
//             preserveScroll: true,
//             preserveState: true,
//             showProgress: false,
//         });
//     };

//     const handleDeleteAll = () => {
//         if (
//             !confirm(
//                 'Êtes-vous sûr de vouloir supprimer TOUTES vos notifications ?',
//             )
//         ) {
//             return;
//         }

//         router.delete(route('tenant.notifications.destroy-all'), {
//             preserveScroll: true,
//             onSuccess: () =>
//                 toast.success('Toutes les notifications ont été supprimées.', {
//                     style: getToastStyles(),
//                 }),
//         });
//     };

//     return (
//         <div className="mx-auto w-full max-w-5xl space-y-6">
//             {/* ─── Header ─── */}
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
//                             <Bell className="h-5 w-5 text-primary" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
//                                 Notifications
//                             </h1>
//                             <p className="text-sm text-slate-500 dark:text-slate-400">
//                                 {notifications.total} notification
//                                 {notifications.total > 1 ? 's' : ''}
//                                 {unreadCount > 0 && (
//                                     <span className="ml-1 font-semibold text-primary">
//                                         · {unreadCount} non lue
//                                         {unreadCount > 1 ? 's' : ''}
//                                     </span>
//                                 )}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={handleMarkAllAsRead}
//                         className="rounded-xl text-xs shadow-sm"
//                         disabled={unreadCount === 0}
//                     >
//                         <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
//                         Tout marquer lu
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={handleDeleteAll}
//                         className="rounded-xl border-red-200 text-xs text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
//                         disabled={notifications.total === 0}
//                     >
//                         <Trash2 className="mr-1.5 h-3.5 w-3.5" />
//                         Tout supprimer
//                     </Button>
//                 </div>
//             </div>

//             {/* ─── Card ─── */}
//             <Card className="overflow-hidden rounded-2xl border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-slate-950/20">
//                 {/* Tabs bar */}
//                 <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
//                     <Tabs
//                         value={activeTab}
//                         onValueChange={handleTabChange}
//                         className="w-full"
//                     >
//                         <TabsList className="grid w-full max-w-xs grid-cols-2 rounded-xl">
//                             <TabsTrigger
//                                 value="all"
//                                 className="rounded-lg text-xs"
//                             >
//                                 Toutes ({notifications.total})
//                             </TabsTrigger>
//                             <TabsTrigger
//                                 value="unread"
//                                 className="rounded-lg text-xs"
//                             >
//                                 Non lues
//                             </TabsTrigger>
//                         </TabsList>
//                     </Tabs>
//                 </div>

//                 {/* Body */}
//                 <div className="min-h-87.5">
//                     {isLoading ? (
//                         /* Skeleton */
//                         <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
//                             {Array.from({ length: 5 }).map((_, i) => (
//                                 <div
//                                     key={i}
//                                     className="flex items-start gap-4 p-5"
//                                 >
//                                     <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
//                                     <div className="flex-1 space-y-2">
//                                         <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
//                                         <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : notifications.data.length === 0 ? (
//                         /* Empty state */
//                         <div className="flex h-87.5 flex-col items-center justify-center text-center">
//                             <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
//                                 <Bell className="h-10 w-10 text-slate-300 dark:text-slate-600" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                 Aucune notification
//                             </h3>
//                             <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
//                                 {activeTab === 'unread'
//                                     ? 'Bravo ! Vous êtes à jour. Toutes vos notifications ont été lues.'
//                                     : "Vous n'avez pas encore reçu de notification."}
//                             </p>
//                         </div>
//                     ) : (
//                         /* List */
//                         <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
//                             <AnimatePresence mode="popLayout">
//                                 {notifications.data.map((notification, idx) => {
//                                     const isUnread = !notification.read_at;
//                                     const detailHref = detailRouteName
//                                         ? route(detailRouteName, {
//                                               id: notification.id,
//                                           })
//                                         : (notification.url ?? '#');

//                                     return (
//                                         <motion.div
//                                             key={notification.id}
//                                             layout
//                                             initial={{ opacity: 0, y: 8 }}
//                                             animate={{
//                                                 opacity: 1,
//                                                 y: 0,
//                                                 transition: {
//                                                     delay: idx * 0.03,
//                                                 },
//                                             }}
//                                             exit={{ opacity: 0, x: -30 }}
//                                         >
//                                             <Link
//                                                 href={detailHref}
//                                                 preserveScroll
//                                                 onClick={() => {
//                                                     if (isUnread) {
//                                                         router.post(
//                                                             route(
//                                                                 'tenant.notifications.mark-as-read',
//                                                                 notification.id,
//                                                             ),
//                                                             {},
//                                                             {
//                                                                 preserveScroll: true,
//                                                                 preserveState: true,
//                                                             },
//                                                         );
//                                                     }
//                                                 }}
//                                                 className={cn(
//                                                     'group relative flex items-start gap-4 p-5 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
//                                                     isUnread &&
//                                                         'bg-linear-to-r from-primary/5 via-transparent to-transparent dark:from-primary/10',
//                                                 )}
//                                             >
//                                                 {/* Left accent */}
//                                                 {isUnread && (
//                                                     <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" />
//                                                 )}

//                                                 {/* Icon */}
//                                                 <div
//                                                     className={cn(
//                                                         'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform duration-200 group-hover:scale-105',
//                                                         getColorForType(
//                                                             notification.type,
//                                                         ),
//                                                     )}
//                                                 >
//                                                     {getIconForType(
//                                                         notification.type,
//                                                     )}
//                                                 </div>

//                                                 {/* Content */}
//                                                 <div className="min-w-0 flex-1 space-y-1">
//                                                     <div className="flex items-center gap-2">
//                                                         <h4
//                                                             className={cn(
//                                                                 'truncate text-sm',
//                                                                 isUnread
//                                                                     ? 'font-bold text-slate-900 dark:text-white'
//                                                                     : 'font-medium text-slate-700 dark:text-slate-200',
//                                                             )}
//                                                         >
//                                                             {notification.title}
//                                                         </h4>
//                                                         {isUnread && (
//                                                             <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
//                                                         )}
//                                                     </div>
//                                                     <p
//                                                         className={cn(
//                                                             'line-clamp-2 text-sm leading-relaxed',
//                                                             isUnread
//                                                                 ? 'text-slate-600 dark:text-slate-300'
//                                                                 : 'text-slate-500 dark:text-slate-400',
//                                                         )}
//                                                     >
//                                                         {notification.message}
//                                                     </p>
//                                                     <p className="text-xs text-slate-400 dark:text-slate-500">
//                                                         {formatDistanceToNow(
//                                                             new Date(
//                                                                 notification.created_at,
//                                                             ),
//                                                             {
//                                                                 addSuffix: true,
//                                                                 locale: fr,
//                                                             },
//                                                         )}
//                                                     </p>
//                                                 </div>

//                                                 {/* Actions (appear on hover) */}
//                                                 <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
//                                                     {isUnread && (
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             onClick={(e) =>
//                                                                 handleMarkAsRead(
//                                                                     e,
//                                                                     notification.id,
//                                                                 )
//                                                             }
//                                                             className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary"
//                                                             title="Marquer comme lu"
//                                                         >
//                                                             <Check className="h-4 w-4" />
//                                                         </Button>
//                                                     )}
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         onClick={(e) =>
//                                                             handleDelete(
//                                                                 e,
//                                                                 notification.id,
//                                                             )
//                                                         }
//                                                         className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
//                                                         title="Supprimer"
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                     </Button>
//                                                     <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
//                                                 </div>
//                                             </Link>
//                                         </motion.div>
//                                     );
//                                 })}
//                             </AnimatePresence>
//                         </div>
//                     )}
//                 </div>

//                 {/* Pagination */}
//                 {notifications.last_page > 1 && (
//                     <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
//                         <p className="text-xs text-slate-500">
//                             Page {notifications.current_page} sur{' '}
//                             {notifications.last_page} · {notifications.total}{' '}
//                             résultat{notifications.total > 1 ? 's' : ''}
//                         </p>
//                         <div className="flex items-center gap-1">
//                             {notifications.links.map((link, i) => {
//                                 if (link.url === null) {
//                                     return (
//                                         <span
//                                             key={i}
//                                             className="px-2.5 py-1 text-xs text-slate-400"
//                                             dangerouslySetInnerHTML={{
//                                                 __html: link.label,
//                                             }}
//                                         />
//                                     );
//                                 }

//                                 return (
//                                     <Link
//                                         key={i}
//                                         href={`${link.url}&tab=${activeTab}`}
//                                         className={cn(
//                                             'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
//                                             link.active
//                                                 ? 'bg-primary text-primary-foreground shadow-sm'
//                                                 : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
//                                         )}
//                                         dangerouslySetInnerHTML={{
//                                             __html: link.label,
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}
//             </Card>
//         </div>
//     );
// }

// resources/js/components/ecommerce/notifications/NotificationManager.tsx
import { Link, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getToastStyles } from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';
import { NotificationItem } from './NotificationItem';

interface PaginatedNotifications {
    data: DashboardNotification[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface NotificationManagerProps {
    notifications: PaginatedNotifications;
    activeTab: 'all' | 'unread';
    detailRouteName?: string;
    onMarkAllAsRead?: () => void;
    onDeleteAll?: () => void;
    onTabChange?: (tab: 'all' | 'unread') => void;
}

export function NotificationManager({
    notifications,
    activeTab,
    detailRouteName,
    onMarkAllAsRead,
    onDeleteAll,
    onTabChange,
}: NotificationManagerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    const handleTabChange = (value: string) => {
        setIsLoading(true);

        if (onTabChange) {
            onTabChange(value as 'all' | 'unread');
            setIsLoading(false);
        } else {
            router.get(
                window.location.pathname,
                { tab: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                    showProgress: false,
                    onFinish: () => setIsLoading(false),
                },
            );
        }
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) {
            toast.info('Aucune notification non lue.', {
                style: getToastStyles(),
            });

            return;
        }

        if (onMarkAllAsRead) {
            onMarkAllAsRead();
        } else {
            router.post(
                route('tenant.notifications.mark-all-as-read'),
                {},
                {
                    preserveScroll: true,
                    showProgress: false,
                    onSuccess: () =>
                        toast.success(
                            'Toutes les notifications ont été marquées comme lues.',
                            {
                                style: getToastStyles(),
                            },
                        ),
                },
            );
        }
    };

    const handleDeleteAll = () => {
        if (notifications.total === 0) {
            return;
        }

        if (
            !confirm(
                'Êtes-vous sûr de vouloir supprimer TOUTES vos notifications ?',
            )
        ) {
            return;
        }

        if (onDeleteAll) {
            onDeleteAll();
        } else {
            router.delete(route('tenant.notifications.destroy-all'), {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        'Toutes les notifications ont été supprimées.',
                        {
                            style: getToastStyles(),
                        },
                    ),
            });
        }
    };

    const handleMarkAsRead = (id: string) => {
        router.post(
            route('tenant.notifications.mark-as-read', id),
            {},
            { preserveScroll: true, preserveState: true, showProgress: false },
        );
    };

    const handleDelete = (id: string) => {
        router.delete(route('tenant.notifications.destroy', id), {
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
        });
    };

    const renderPaginationLinks = () => {
        return notifications.links.map((link, i) => {
            if (link.url === null) {
                return (
                    <span
                        key={i}
                        className="px-2.5 py-1 text-xs text-slate-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            }

            const url = new URL(link.url);
            url.searchParams.set('tab', activeTab);

            return (
                <Link
                    key={i}
                    href={url.toString()}
                    className={cn(
                        'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                        link.active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            );
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                        <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Notifications
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {notifications.total} notification
                            {notifications.total > 1 ? 's' : ''}
                            {unreadCount > 0 && (
                                <span className="ml-1 font-semibold text-primary">
                                    · {unreadCount} non lue
                                    {unreadCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="rounded-xl text-xs shadow-sm"
                        disabled={unreadCount === 0}
                    >
                        <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                        Tout marquer lu
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAll}
                        className="rounded-xl border-red-200 text-xs text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                        disabled={notifications.total === 0}
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Tout supprimer
                    </Button>
                </div>
            </div>

            {/* Card */}
            <Card className="overflow-hidden rounded-2xl border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-slate-950/20">
                {/* Tabs */}
                <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full"
                    >
                        <TabsList className="grid w-full max-w-xs grid-cols-2 rounded-xl">
                            <TabsTrigger
                                value="all"
                                className="rounded-lg text-xs"
                            >
                                Toutes ({notifications.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="rounded-lg text-xs"
                            >
                                Non lues ({unreadCount})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Body */}
                <div className="min-h-87.5">
                    {isLoading ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-5"
                                >
                                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.data.length === 0 ? (
                        <div className="flex h-87.5 flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Bell className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Aucune notification
                            </h3>
                            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                {activeTab === 'unread'
                                    ? 'Bravo ! Vous êtes à jour. Toutes vos notifications ont été lues.'
                                    : "Vous n'avez pas encore reçu de notification."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            <AnimatePresence mode="popLayout">
                                {notifications.data.map((notification) => {
                                    const isUnread = !notification.read_at;
                                    const detailHref = detailRouteName
                                        ? route(detailRouteName, {
                                              id: notification.id,
                                          })
                                        : (notification.url ?? '#');

                                    return (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={handleMarkAsRead}
                                            onDelete={handleDelete}
                                            showActions={true}
                                            variant="full"
                                        />
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <p className="text-xs text-slate-500">
                            Page {notifications.current_page} sur{' '}
                            {notifications.last_page} · {notifications.total}{' '}
                            résultat{notifications.total > 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-1">
                            {renderPaginationLinks()}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
