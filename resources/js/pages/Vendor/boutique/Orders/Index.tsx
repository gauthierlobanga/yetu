/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// resources/js/pages/Shop/Orders/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { Link, usePage, Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    AlertCircle,
    ChevronRight,
    Search,
    Filter,
    Plus,
    TrendingUp,
    BarChart3,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import CountUp from 'react-countup';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface Order {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    date_commande?: string | null;
    created_at: string;
    lignes_count?: number;
}

interface Stats {
    total: number;
    en_attente: number;
    en_cours: number;
    termine: number;
    annule: number;
    rejete: number;
    total_amount: number;
}

interface TrendItem {
    month: string;
    count: number;
    amount: number;
}

interface Props extends PageProps {
    orders: {
        data: Order[];
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
    stats?: Stats; // peut être absent si erreur serveur
    trendData?: TrendItem[]; // idem
    filters?: {
        statut?: string;
        search?: string;
    };
}

// Valeurs par défaut fiables pour Stats
const EMPTY_STATS: Stats = {
    total: 0,
    en_attente: 0,
    en_cours: 0,
    termine: 0,
    annule: 0,
    rejete: 0,
    total_amount: 0,
};

// Mapping des statuts
const statusConfig: Record<
    string,
    { label: string; icon: any; className: string; color: string }
> = {
    en_attente: {
        label: 'En attente',
        icon: Clock,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        color: 'amber',
    },
    en_cours: {
        label: 'En cours',
        icon: Truck,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        color: 'blue',
    },
    termine: {
        label: 'Terminée',
        icon: CheckCircle,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        color: 'emerald',
    },
    annule: {
        label: 'Annulée',
        icon: XCircle,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        color: 'red',
    },
    rejete: {
        label: 'Rejetée',
        icon: AlertCircle,
        className:
            'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
        color: 'slate',
    },
};

// Helper pour décoder les entités HTML sans impact sur le DOM
function decodeHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.documentElement.textContent || '';
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

function StatusBadge({ statut }: { statut: string }) {
    const config = statusConfig[statut] ?? statusConfig.en_attente;
    const StatusIcon = config.icon;

    return (
        <Badge
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize',
                config.className,
            )}
        >
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
        </Badge>
    );
}

export default function ShopOrdersIndexPage() {
    const {
        orders,
        stats: rawStats,
        trendData: rawTrendData = [],
        filters = {},
    } = usePage<Props>().props;

    // Fusionner avec les valeurs par défaut → plus jamais undefined
    const stats: Stats = { ...EMPTY_STATS, ...(rawStats ?? {}) };
    const trendData = rawTrendData;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState<string | null>(
        filters.statut || null,
    );

    const handleFilter = (statut: string | null) => {
        setSelectedStatus(statut);
        router.get(
            window.location.pathname,
            {
                statut: statut || undefined,
                search: searchTerm || undefined,
            },
            { preserveState: true, preserveScroll: true, showProgress: false },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            window.location.pathname,
            {
                search: searchTerm || undefined,
                statut: selectedStatus || undefined,
            },
            { preserveState: true, preserveScroll: true, showProgress: false },
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus(null);
        router.get(
            window.location.pathname,
            {},
            { preserveState: true, preserveScroll: true, showProgress: false },
        );
    };

    const hasActiveFilters = searchTerm || selectedStatus;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0,
        }).format(value);

    // Données pour le PieChart
    const pieData = useMemo(
        () =>
            [
                {
                    name: 'En attente',
                    value: stats.en_attente,
                    color: '#f59e0b',
                },
                { name: 'En cours', value: stats.en_cours, color: '#3b82f6' },
                { name: 'Terminées', value: stats.termine, color: '#10b981' },
                { name: 'Annulées', value: stats.annule, color: '#ef4444' },
                { name: 'Rejetées', value: stats.rejete, color: '#8b5cf6' },
            ].filter((d) => d.value > 0),
        [stats],
    );

    // Données pour l'AreaChart (tendance)
    const trendChartData = useMemo(
        () => trendData.map((d) => ({ month: d.month, commandes: d.count })),
        [trendData],
    );

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Mes commandes" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* En-tête */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Mes commandes
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Consultez l'historique de vos achats, suivez
                                    leur statut et accédez au détail de chaque
                                    commande.
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="gap-2 rounded-xl"
                            >
                                <Link href={tenant.product.index().url}>
                                    <Plus className="h-4 w-4" />
                                    Nouvelle commande
                                </Link>
                            </Button>
                        </div>

                        {/* Statistiques + Graphiques */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            <StatCard
                                label="Total"
                                value={stats.total}
                                icon={ShoppingBag}
                                color="slate"
                            />
                            <StatCard
                                label="En attente"
                                value={stats.en_attente}
                                icon={Clock}
                                color="amber"
                            />
                            <StatCard
                                label="En cours"
                                value={stats.en_cours}
                                icon={Truck}
                                color="blue"
                            />
                            <StatCard
                                label="Terminées"
                                value={stats.termine}
                                icon={CheckCircle}
                                color="emerald"
                            />
                            <StatCard
                                label="Annulées"
                                value={stats.annule}
                                icon={XCircle}
                                color="red"
                            />
                            <StatCard
                                label="Rejetées"
                                value={stats.rejete}
                                icon={AlertCircle}
                                color="slate"
                            />
                        </div>

                        {/* Graphiques modernes */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Tendance des commandes */}
                            <Card className="rounded-2xl border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/70 dark:shadow-black/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                                        Évolution des commandes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {trendChartData.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <AreaChart
                                                data={trendChartData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="colorOrders"
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
                                                <Area
                                                    type="monotone"
                                                    dataKey="commandes"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    fill="url(#colorOrders)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Répartition par statut */}
                            <Card className="rounded-2xl border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/70 dark:shadow-black/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                                        Répartition par statut
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center">
                                    {pieData.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <div className="flex w-full items-center">
                                            <div className="w-1/2">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={200}
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            innerRadius={50}
                                                            paddingAngle={3}
                                                            stroke="none"
                                                        >
                                                            {pieData.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            COLORS[
                                                                                index %
                                                                                    COLORS.length
                                                                            ]
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                background:
                                                                    'rgba(255,255,255,0.9)',
                                                                borderRadius:
                                                                    '12px',
                                                                border: 'none',
                                                                boxShadow:
                                                                    '0 4px 12px rgba(0,0,0,0.1)',
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="w-1/2 space-y-2">
                                                {pieData.map((d, i) => (
                                                    <div
                                                        key={d.name}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <span
                                                            className="h-3 w-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    COLORS[
                                                                        i %
                                                                            COLORS.length
                                                                    ],
                                                            }}
                                                        />
                                                        <span className="flex-1 text-slate-600 dark:text-slate-300">
                                                            {d.name}
                                                        </span>
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {d.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filtres améliorés */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="flex flex-wrap items-center gap-2">
                                <Filter className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Statut :
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => handleFilter(null)}
                                        className={cn(
                                            'rounded-full px-3 py-1 text-xs font-medium transition-all',
                                            !selectedStatus
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                                        )}
                                    >
                                        Tous
                                    </button>
                                    {Object.keys(statusConfig).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => handleFilter(key)}
                                            className={cn(
                                                'rounded-full px-3 py-1 text-xs font-medium transition-all',
                                                selectedStatus === key
                                                    ? 'bg-emerald-500 text-white shadow-sm'
                                                    : `border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300`,
                                            )}
                                        >
                                            {statusConfig[key].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-2"
                            >
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher une commande..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="h-9 w-full rounded-xl border-slate-200 pr-3 pl-9 text-sm sm:w-56 dark:border-slate-700"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-xl"
                                >
                                    Rechercher
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-xs text-slate-400 hover:text-slate-600"
                                    >
                                        Réinitialiser
                                    </Button>
                                )}
                            </form>
                        </div>

                        {/* Tableau des commandes */}
                        <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Historique
                                    </CardTitle>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {orders.total} commande
                                        {orders.total > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {orders.data.length > 0 ? (
                                    <>
                                        <div className="hidden md:block">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                                        <th className="px-6 py-3 text-left font-medium text-slate-500">
                                                            Commande
                                                        </th>
                                                        <th className="px-6 py-3 text-left font-medium text-slate-500">
                                                            Date
                                                        </th>
                                                        <th className="px-6 py-3 text-left font-medium text-slate-500">
                                                            Articles
                                                        </th>
                                                        <th className="px-6 py-3 text-left font-medium text-slate-500">
                                                            Statut
                                                        </th>
                                                        <th className="px-6 py-3 text-right font-medium text-slate-500">
                                                            Total
                                                        </th>
                                                        <th className="px-6 py-3 text-right font-medium text-slate-500">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.data.map(
                                                        (order) => (
                                                            <motion.tr
                                                                key={order.id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 8,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                                className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                                            >
                                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                                    {
                                                                        order.numero_commande
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                                    {order.date_commande
                                                                        ? new Date(
                                                                              order.date_commande,
                                                                          ).toLocaleDateString(
                                                                              'fr-FR',
                                                                              {
                                                                                  day: 'numeric',
                                                                                  month: 'short',
                                                                                  year: 'numeric',
                                                                              },
                                                                          )
                                                                        : new Date(
                                                                              order.created_at,
                                                                          ).toLocaleDateString(
                                                                              'fr-FR',
                                                                              {
                                                                                  day: 'numeric',
                                                                                  month: 'short',
                                                                                  year: 'numeric',
                                                                              },
                                                                          )}
                                                                </td>
                                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                                    {order.lignes_count ??
                                                                        '-'}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <StatusBadge
                                                                        statut={
                                                                            order.statut
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                                                                    {typeof order.total ===
                                                                    'number'
                                                                        ? formatCurrency(
                                                                              order.total,
                                                                          )
                                                                        : order.total}
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="rounded-xl text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                tenant.orders.show(
                                                                                    order.id,
                                                                                )
                                                                                    .url
                                                                            }
                                                                        >
                                                                            Voir{' '}
                                                                            <ChevronRight className="ml-1 h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                </td>
                                                            </motion.tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-col gap-4 p-4 md:hidden">
                                            {orders.data.map((order) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {
                                                                order.numero_commande
                                                            }
                                                        </span>
                                                        <StatusBadge
                                                            statut={
                                                                order.statut
                                                            }
                                                        />
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            {order.date_commande
                                                                ? new Date(
                                                                      order.date_commande,
                                                                  ).toLocaleDateString(
                                                                      'fr-FR',
                                                                      {
                                                                          day: 'numeric',
                                                                          month: 'short',
                                                                          year: 'numeric',
                                                                      },
                                                                  )
                                                                : new Date(
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
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {typeof order.total ===
                                                            'number'
                                                                ? formatCurrency(
                                                                      order.total,
                                                                  )
                                                                : order.total}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    tenant.orders.show(
                                                                        order.id,
                                                                    ).url
                                                                }
                                                            >
                                                                Voir le détail{' '}
                                                                <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Dans la partie pagination, remplacez le bloc par : */}
                                        {orders.last_page > 1 && (
                                            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 dark:border-slate-800">
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Page {orders.current_page}{' '}
                                                    sur {orders.last_page}
                                                </p>
                                                <div className="flex gap-1">
                                                    {orders.links?.map(
                                                        (link, index) => {
                                                            // On ignore les liens sans URL (points de suspension)
                                                            if (
                                                                link.url ===
                                                                null
                                                            ) {
                                                                return (
                                                                    <span
                                                                        key={
                                                                            link.label
                                                                        }
                                                                        className="px-3 py-1 text-xs text-slate-400"
                                                                    >
                                                                        {decodeHtml(
                                                                            link.label,
                                                                        )}
                                                                    </span>
                                                                );
                                                            }

                                                            return (
                                                                <Link
                                                                    key={
                                                                        link.url
                                                                    }
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    className={cn(
                                                                        'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                                                        link.active
                                                                            ? 'bg-emerald-500 text-white'
                                                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                                                    )}
                                                                >
                                                                    {decodeHtml(
                                                                        link.label,
                                                                    )}
                                                                </Link>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                            <ShoppingBag className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                                            Aucune commande trouvée
                                        </h3>
                                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                                            {hasActiveFilters
                                                ? 'Aucune commande ne correspond à vos filtres.'
                                                : "Vous n'avez pas encore passé de commande."}
                                        </p>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="mt-4 rounded-xl"
                                            >
                                                Réinitialiser les filtres
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

// Composant StatCard modernisé
function StatCard({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    icon: any;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        emerald:
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <Card className="group rounded-xl border-0 bg-white/70 shadow-md shadow-slate-200/20 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900/70 dark:shadow-black/20">
            <CardContent className="flex items-center gap-3 p-3">
                <div
                    className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        colorClasses[color] || colorClasses.slate,
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="text-xl font-bold text-slate-900 tabular-nums dark:text-white">
                        <CountUp
                            start={0}
                            end={value}
                            duration={1.5}
                            separator=" "
                        />
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
