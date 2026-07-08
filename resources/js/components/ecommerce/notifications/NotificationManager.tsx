/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/ecommerce/notifications/NotificationManager.tsx
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    CheckCheck,
    Trash2,
    PieChart,
    TrendingUp,
    CircleDot,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import CountUp from 'react-countup';
import {
    ResponsiveContainer,
    PieChart as RPieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    stats?: {
        total_by_type: Record<string, number>;
        monthly_trend: { month: string; count: number }[];
    };
}

const TYPE_COLORS: Record<string, string> = {
    order: '#10b981',
    payment: '#f59e0b',
    shipping: '#3b82f6',
    system: '#8b5cf6',
    promotion: '#ec4899',
};

const TYPE_LABELS: Record<string, string> = {
    order: 'Commandes',
    payment: 'Paiements',
    shipping: 'Livraison',
    system: 'Système',
    promotion: 'Promotions',
};

export function NotificationManager({
    notifications,
    activeTab,
    detailRouteName,
    onMarkAllAsRead,
    onDeleteAll,
    onTabChange,
    stats: rawStats,
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
                        toast.success('Toutes les notifications lues.'),
                },
            );
        }
    };

    const handleDeleteAll = () => {
        if (notifications.total === 0) {
            return;
        }

        if (!confirm('Supprimer toutes les notifications ?')) {
            return;
        }

        if (onDeleteAll) {
            onDeleteAll();
        } else {
            router.delete(route('tenant.notifications.destroy-all'), {
                preserveScroll: true,
                onSuccess: () => toast.success('Notifications supprimées.'),
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

    const pieData = useMemo(() => {
        if (!rawStats?.total_by_type) {
            return [];
        }

        return Object.entries(rawStats.total_by_type).map(([type, count]) => ({
            name: TYPE_LABELS[type] ?? type,
            value: count,
            fill: TYPE_COLORS[type] ?? '#94a3b8',
        }));
    }, [rawStats]);

    const barData = useMemo(() => {
        if (!rawStats?.monthly_trend) {
            return [];
        }

        return rawStats.monthly_trend.map((d) => ({
            month: d.month,
            count: d.count,
        }));
    }, [rawStats]);

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Notifications
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            <CountUp
                                start={0}
                                end={notifications.total}
                                duration={1}
                            />{' '}
                            notification(s) ·{' '}
                            <span className="font-semibold text-primary">
                                <CountUp
                                    start={0}
                                    end={unreadCount}
                                    duration={1}
                                />{' '}
                                non lue(s)
                            </span>
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
                        <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Tout
                        marquer lu
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAll}
                        className="rounded-xl border-red-200 text-xs text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                        disabled={notifications.total === 0}
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Tout supprimer
                    </Button>
                </div>
            </div>

            {/* Graphiques (optionnels) */}
            {rawStats && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <PieChart className="h-5 w-5 text-emerald-500" />{' '}
                                Notifications par type
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            {pieData.length > 0 ? (
                                <>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={220}
                                    >
                                        <RPieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={50}
                                                paddingAngle={5}
                                                stroke="none"
                                                label={({ percent }) =>
                                                    percent != null
                                                        ? `${(percent * 100).toFixed(0)}%`
                                                        : ''
                                                }
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background:
                                                        'rgba(255,255,255,0.9)',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow:
                                                        '0 4px 12px rgba(0,0,0,0.1)',
                                                }}
                                            />
                                        </RPieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                                        {pieData.map((d) => (
                                            <div
                                                key={d.name}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor: d.fill,
                                                    }}
                                                />
                                                <span className="text-slate-600 dark:text-slate-300">
                                                    {d.name}
                                                </span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {d.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="py-8 text-sm text-slate-500">
                                    Aucune donnée
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <TrendingUp className="h-5 w-5 text-emerald-500" />{' '}
                                Évolution mensuelle
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {barData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        data={barData}
                                        margin={{
                                            top: 5,
                                            right: 20,
                                            left: 0,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                            strokeOpacity={0.5}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{
                                                fontSize: 11,
                                                fill: '#94a3b8',
                                            }}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: '#94a3b8',
                                            }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background:
                                                    'rgba(255,255,255,0.9)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow:
                                                    '0 4px 12px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="#10b981"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="py-8 text-center text-sm text-slate-500">
                                    Aucune donnée
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Card notifications */}
            <Card className="overflow-hidden rounded-2xl border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-slate-950/20">
                {/* Tabs modernes */}
                <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <Tabs
                            value={activeTab}
                            onValueChange={handleTabChange}
                            className="w-full"
                        >
                            <TabsList className="relative grid w-full max-w-xs grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                                {/* Fond animé pour l'onglet actif */}
                                <motion.div
                                    layoutId="notification-tab-indicator"
                                    className="absolute inset-y-1 z-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
                                    style={{
                                        width: `calc(50% - 4px)`,
                                        left:
                                            activeTab === 'all'
                                                ? '4px'
                                                : 'calc(50% + 0px)',
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                                <TabsTrigger
                                    value="all"
                                    className="relative z-10 rounded-lg text-xs font-medium transition-colors hover:text-slate-700 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-500 dark:hover:text-slate-300 dark:data-[state=active]:text-white dark:data-[state=inactive]:text-slate-400"
                                >
                                    <Bell className="mr-1.5 h-3.5 w-3.5" />
                                    Toutes
                                    <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                                        {notifications.total}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="unread"
                                    className="relative z-10 rounded-lg text-xs font-medium transition-colors hover:text-slate-700 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-500 dark:hover:text-slate-300 dark:data-[state=active]:text-white dark:data-[state=inactive]:text-slate-400"
                                >
                                    <CircleDot className="mr-1.5 h-3.5 w-3.5" />
                                    Non lues
                                    {unreadCount > 0 && (
                                        <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                            {unreadCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

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
                                    ? 'Bravo ! Vous êtes à jour.'
                                    : "Vous n'avez pas encore reçu de notification."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            <AnimatePresence mode="popLayout">
                                {notifications.data.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                        showActions={true}
                                        variant="full"
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <p className="text-xs text-slate-500">
                            Page {notifications.current_page} sur{' '}
                            {notifications.last_page} · {notifications.total}{' '}
                            résultat(s)
                        </p>
                        <div className="flex items-center gap-1">
                            {notifications.links.map((link, i) => {
                                if (link.url === null) {
                                    return (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 text-xs text-slate-400"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
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
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
