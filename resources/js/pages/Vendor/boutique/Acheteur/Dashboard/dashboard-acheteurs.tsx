/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/customs/dashboard-acheteurs.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Gift,
    Package,
    RotateCcw,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Tag,
    Target,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { AppSidebar } from '@/components/app-sidebar';
import {
    ChartAreaGradient,
    ChartAreaInteractive,
    ChartBarNegative,
    ChartLineLabel,
} from '@/components/ecommerce/buyer/charts/BuyerCharts';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

/* ---------- Types ---------- */
interface OrderItem {
    id: string;
    numero_commande: string;
    statut: string;
    total: number;
    created_at: string;
    lignes_count: number;
}

interface AdvancedStats {
    order_growth: number;
    completed_rate: number;
    orders_this_month: number;
}

interface WeeklySpending {
    day: string;
    total: number;
}

interface TopCategory {
    nom: string;
    total: number;
}

interface Props extends PageProps {
    stats: {
        orders_count: number;
        completed_orders: number;
        addresses_count: number;
        wishlist_items_count: number;
        pending_returns_count: number;
        loyalty_points: number;
        loyalty_level: string;
        total_spent: number;
        avg_order_amount: number;
        total_products_bought: number;
    };
    advancedStats: AdvancedStats;
    weeklySpending: WeeklySpending[];
    topCategories: TopCategory[];
    recentOrders: OrderItem[];
    wishlist?: { nom?: string; items_count?: number } | null;
    loyalty?: { points?: number; niveau_libelle?: string } | null;
    monthlyOrders: Record<string, { count: number; total: number }>;
    statusDistribution: Record<string, number>;
    loyaltyHistory: Record<
        string,
        { gain: number; utilisation: number }
    > | null;
    dailySpending: { date: string; count: number; total: number }[];
    abandonedCart?: {
        id: string;
        total_general: number;
        items_count: number;
        date_abandon: string;
    } | null;
}

/* ---------- Constantes ---------- */
const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];
const MONTHS = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Août',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
];
const DAYS_MAP: Record<string, string> = {
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mer',
    Thu: 'Jeu',
    Fri: 'Ven',
    Sat: 'Sam',
    Sun: 'Dim',
};

const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);

const statusVariant: Record<string, string> = {
    en_attente:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    confirmee:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    en_preparation:
        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    expediee:
        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    termine:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    annulee:
        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

function getStatusBadge(statut: string) {
    return (
        <Badge
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusVariant[statut] ?? 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400'}`}
        >
            {statut.replace('_', ' ')}
        </Badge>
    );
}

/* ---------- Composants de carte ---------- */

// Carte KPI principale (4 premiers)
function KpiCard({
    icon: Icon,
    label,
    value,
    helper,
    trend,
    trendLabel,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    helper?: string;
    trend?: number;
    trendLabel?: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {helper && (
                        <p className="mt-0.5 text-xs text-slate-400">
                            {helper}
                        </p>
                    )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {trend !== undefined && (
                <div className="mt-3 flex items-center gap-1.5">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            trend >= 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                    >
                        {trend > 0 ? '+' : ''}
                        {trend}%
                    </span>
                    {trendLabel && (
                        <span className="text-xs text-slate-400">
                            {trendLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Carte pour les statistiques avancées avec mini-graphique
function AdvancedStatCard({
    icon: Icon,
    label,
    value,
    subtitle,
    chartData,
    chartKey,
    chartColor = '#10b981',
    progress,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subtitle?: string;
    chartData?: Record<string, unknown>[];
    chartKey?: string;
    chartColor?: string;
    progress?: number;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {chartData && chartKey && (
                <div className="mt-3 h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id={`grad-${label}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={chartColor}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={chartColor}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey={chartKey}
                                stroke={chartColor}
                                fill={`url(#grad-${label})`}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
            {progress !== undefined && (
                <div className="mt-3">
                    <Progress
                        value={progress}
                        className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-emerald-500"
                    />
                </div>
            )}
        </div>
    );
}

/* ---------- Page ---------- */
export default function DashboardCustomerBuyer() {
    const {
        stats,
        advancedStats,
        recentOrders,
        monthlyOrders,
        statusDistribution,
        loyalty,
        auth,
        weeklySpending,
        topCategories,
        abandonedCart,
        loyaltyHistory,
        dailySpending,
    } = usePage<Props>().props;

    const { cart } = useCart();

    // Panier abandonné synchronisé
    const activeAbandonedCart = abandonedCart
        ? {
              ...abandonedCart,
              total_general:
                  cart && String(cart.id) === String(abandonedCart.id)
                      ? cart.total_general
                      : abandonedCart.total_general,
              items_count:
                  cart && String(cart.id) === String(abandonedCart.id)
                      ? cart.nb_articles
                      : abandonedCart.items_count,
          }
        : null;

    const showAbandonedCart =
        activeAbandonedCart && activeAbandonedCart.items_count > 0;

    // Données des graphiques
    const orderChartData = Object.entries(monthlyOrders).map(
        ([month, data]) => ({
            month: MONTHS[parseInt(month.split('-')[1], 10) - 1],
            commandes: data.count,
        }),
    );

    // Derniers 6 mois pour le mini-graphique
    const lastSixMonths = orderChartData.slice(-6);

    const statusChartData = Object.entries(statusDistribution).map(
        ([key, value]) => ({
            name: key.replace('_', ' '),
            value,
        }),
    );

    const spendingChartData = (weeklySpending || []).map((item) => ({
        day: DAYS_MAP[item.day] || item.day,
        total: item.total,
    }));

    const maxCategoryTotal = Math.max(
        ...(topCategories || []).map((c) => c.total),
        1,
    );

    // Calcul du nombre de commandes du mois dernier pour comparaison
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const lastMonthKey =
        currentMonth === 1
            ? `${currentYear - 1}-12`
            : `${currentYear}-${String(currentMonth - 1).padStart(2, '0')}`;
    const ordersThisMonth = monthlyOrders[currentMonthKey]?.count || 0;
    const ordersLastMonth = monthlyOrders[lastMonthKey]?.count || 0;
    const monthOverMonth =
        ordersLastMonth > 0
            ? Math.round(
                  ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100,
              )
            : 0;

    return (
        <SidebarProvider
            className={cn(
                'h-screen overflow-hidden',
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-transparent',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88',
            )}
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Dashboard client" />
            <AppSidebar />
            <SidebarInset className="flex min-h-0 flex-col">
                <SiteHeader context="buyer" />
                <ScrollArea className="min-h-0 flex-1">
                    <div className="bg-slate-50/50 dark:bg-slate-950">
                        <div className="space-y-8 p-4 md:p-8">
                            {/* En‑tête */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Bonjour {auth.user.name}
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Voici un aperçu de votre activité
                                        récente.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <Calendar className="mr-1 h-3.5 w-3.5" />
                                        {new Date().toLocaleDateString(
                                            'fr-FR',
                                            {
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}
                                    </Badge>
                                </div>
                            </div>

                            {/* Bannière Panier Abandonné (modernisée) */}
                            {showAbandonedCart && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative overflow-hidden rounded-2xl border border-orange-200/50 bg-linear-to-br from-orange-50 via-amber-50 to-orange-100/50 p-6 shadow-lg dark:border-orange-900/30 dark:from-orange-950/40 dark:via-amber-950/20 dark:to-orange-900/10"
                                >
                                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
                                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
                                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-orange-100 dark:bg-orange-950 dark:ring-orange-900">
                                                <ShoppingBag className="h-7 w-7 text-orange-500 dark:text-orange-400" />
                                                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-sm">
                                                    {
                                                        activeAbandonedCart.items_count
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold tracking-tight text-orange-950 dark:text-orange-50">
                                                    Vous avez oublié quelque
                                                    chose ?
                                                </h3>
                                                <p className="mt-1.5 text-sm font-medium text-orange-800/80 dark:text-orange-200/70">
                                                    Votre panier d'une valeur de{' '}
                                                    <span className="rounded-md bg-orange-100/80 px-1.5 py-0.5 font-bold text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                                                        {formatPrice(
                                                            activeAbandonedCart.total_general,
                                                        )}
                                                    </span>{' '}
                                                    vous attend depuis{' '}
                                                    {
                                                        activeAbandonedCart.date_abandon
                                                    }
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route(
                                                'tenant.checkout.index',
                                            )}
                                            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500"
                                        >
                                            Terminer ma commande
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Ligne 1 : 4 KPI principaux */}
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                <KpiCard
                                    icon={Wallet}
                                    label="Total dépensé"
                                    value={formatPrice(stats.total_spent)}
                                    helper={`${stats.orders_count} commandes`}
                                    trend={advancedStats.order_growth}
                                    trendLabel="vs mois dernier"
                                />
                                <KpiCard
                                    icon={ShoppingCart}
                                    label="Panier moyen"
                                    value={formatPrice(stats.avg_order_amount)}
                                    helper="par commande"
                                />
                                <KpiCard
                                    icon={Gift}
                                    label="Points fidélité"
                                    value={stats.loyalty_points}
                                    helper={`Niveau ${stats.loyalty_level}`}
                                />
                                <KpiCard
                                    icon={RotateCcw}
                                    label="Retours en cours"
                                    value={stats.pending_returns_count}
                                />
                            </div>

                            {/* Ligne 2 : 3 statistiques avancées avec mini-graphiques */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <AdvancedStatCard
                                    icon={TrendingUp}
                                    label="Croissance des commandes"
                                    value={`${advancedStats.order_growth}%`}
                                    subtitle={`${monthOverMonth}% vs mois dernier`}
                                    chartData={lastSixMonths}
                                    chartKey="commandes"
                                    chartColor="#10b981"
                                />
                                <AdvancedStatCard
                                    icon={CheckCircle2}
                                    label="Taux de complétion"
                                    value={`${advancedStats.completed_rate}%`}
                                    subtitle="Commandes finalisées"
                                    progress={advancedStats.completed_rate}
                                />
                                <AdvancedStatCard
                                    icon={Target}
                                    label="Commandes ce mois"
                                    value={advancedStats.orders_this_month}
                                    subtitle={`${ordersThisMonth} ce mois`}
                                    chartData={lastSixMonths}
                                    chartKey="commandes"
                                    chartColor="#8b5cf6"
                                />
                            </div>

                            {/* Graphique des dépenses hebdomadaires */}
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                                        Dépenses cette semaine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={spendingChartData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                content={({
                                                    active,
                                                    payload,
                                                    label,
                                                }) => {
                                                    if (
                                                        !active ||
                                                        !payload?.length
                                                    ) {
                                                        return null;
                                                    }

                                                    const value =
                                                        payload[0]?.value;

                                                    return (
                                                        <div className="min-w-47.5 rounded-xl border border-emerald-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-emerald-800/40 dark:bg-slate-900/95">
                                                            <div className="mb-3 flex items-center justify-between">
                                                                <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                                                                    Jour
                                                                </span>
                                                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    {label}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                                                                        <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                                        Dépenses
                                                                    </p>
                                                                </div>
                                                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                                                    {typeof value ===
                                                                    'number'
                                                                        ? formatPrice(
                                                                              value,
                                                                          )
                                                                        : value}
                                                                </h3>
                                                            </div>
                                                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-400" />
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <Bar
                                                dataKey="total"
                                                fill="#10b981"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Graphiques commandes + répartition */}
                            <div className="grid gap-6 xl:grid-cols-3">
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm xl:col-span-2 dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                                            Commandes (6 mois)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={orderChartData}>
                                                <defs>
                                                    <linearGradient
                                                        id="orders"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0.3}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#e2e8f0"
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="commandes"
                                                    stroke="#10b981"
                                                    fill="url(#orders)"
                                                    strokeWidth={3}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Répartition
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={statusChartData}
                                                    dataKey="value"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                >
                                                    {statusChartData.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    CHART_COLORS[
                                                                        index %
                                                                            CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* NOUVELLE SECTION : Analyses Modernes avec Shadcn Charts */}
                            <div className="mb-6">
                                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Analyses & Tendances
                                </h2>
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {/* Dépenses mensuelles (Area Gradient) */}
                                    <ChartAreaGradient
                                        monthlyOrders={monthlyOrders}
                                    />

                                    {/* Historique interactif (Area Interactive) */}
                                    <ChartAreaInteractive
                                        dailySpending={dailySpending}
                                    />

                                    {/* Commandes passées (Line Label) */}
                                    <ChartLineLabel
                                        monthlyOrders={monthlyOrders}
                                    />

                                    {/* Bilan fidélité (Bar Negative) */}
                                    <ChartBarNegative
                                        loyaltyHistory={loyaltyHistory}
                                    />
                                </div>
                            </div>

                            {/* Top catégories + fidélité */}
                            <div className="grid gap-6 xl:grid-cols-2">
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Tag className="h-5 w-5 text-emerald-500" />
                                            Catégories favorites
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {topCategories.map((cat) => (
                                            <div
                                                key={cat.nom}
                                                className="space-y-1.5"
                                            >
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {cat.nom}
                                                    </span>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {cat.total}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        (cat.total /
                                                            maxCategoryTotal) *
                                                        100
                                                    }
                                                    className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-emerald-500"
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Gift className="h-5 w-5 text-amber-500" />
                                            Fidélité
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Niveau
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {loyalty?.niveau_libelle ??
                                                        stats.loyalty_level}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Points
                                                </p>
                                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                    {loyalty?.points ??
                                                        stats.loyalty_points}
                                                </p>
                                            </div>
                                        </div>
                                        <Progress
                                            value={
                                                ((loyalty?.points ?? 0) / 500) *
                                                100
                                            }
                                            className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-amber-500"
                                        />
                                        <p className="text-xs text-slate-400">
                                            500 points pour le prochain niveau
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Dernières commandes */}
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Package className="h-5 w-5 text-emerald-500" />
                                        Dernières commandes
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                        asChild
                                    >
                                        <Link href={tenant.orders.index().url}>
                                            Tout voir
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order, index) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                }}
                                            >
                                                <Link
                                                    href={
                                                        tenant.orders.show(
                                                            order.id,
                                                        ).url
                                                    }
                                                    className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                            <Package className="h-5 w-5 text-slate-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                {
                                                                    order.numero_commande
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                <span>
                                                                    {
                                                                        order.lignes_count
                                                                    }{' '}
                                                                    article(s)
                                                                </span>
                                                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                                <span>
                                                                    {new Date(
                                                                        order.created_at,
                                                                    ).toLocaleDateString(
                                                                        'fr-FR',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(
                                                            order.statut,
                                                        )}
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {formatPrice(
                                                                order.total,
                                                            )}
                                                        </span>
                                                        <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-emerald-500" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                            Aucune commande récente.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    );
}
