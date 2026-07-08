/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Returns/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    RotateCcw,
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    PieChart,
    TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import CountUp from 'react-countup';
import {
    ResponsiveContainer,
    PieChart as RPieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface ReturnItem {
    id: string;
    statut: string;
    motif?: string | null;
    date_demande?: string | null;
    commande?: { id: string; numero_commande: string } | null;
}

interface Stats {
    en_attente: number;
    accepte: number;
    en_cours: number;
    termine: number;
    refuse: number;
}

interface TrendItem {
    month: string;
    total: number;
}

interface Props extends PageProps {
    returns: { data: ReturnItem[]; total: number };
    stats?: Stats;
    trendData?: TrendItem[];
}

const statusConfig: Record<
    string,
    { label: string; icon: any; className: string; color: string }
> = {
    en_attente: {
        label: 'En attente',
        icon: Clock,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        color: '#f59e0b',
    },
    accepte: {
        label: 'Accepté',
        icon: CheckCircle,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        color: '#10b981',
    },
    en_cours: {
        label: 'En cours',
        icon: RotateCcw,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        color: '#3b82f6',
    },
    termine: {
        label: 'Terminé',
        icon: CheckCircle,
        className:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        color: '#8b5cf6',
    },
    refuse: {
        label: 'Refusé',
        icon: XCircle,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        color: '#ef4444',
    },
};

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

export default function ShopReturnsIndexPage() {
    const { returns, stats: rawStats, trendData = [] } = usePage<Props>().props;

    const stats = useMemo(() => {
        if (rawStats) {
            return rawStats;
        }

        // Utilisation d'un Record pour autoriser l'indexation par string
        const d: Record<string, number> = {
            en_attente: 0,
            accepte: 0,
            en_cours: 0,
            termine: 0,
            refuse: 0,
        };
        returns.data.forEach((r) => {
            if (r.statut in d) {
                d[r.statut]++;
            }
        });

        return d;
    }, [returns.data, rawStats]);

    const pieData = useMemo(
        () =>
            Object.entries(stats)
                .filter(([_, v]) => v > 0)
                .map(([key, value]) => ({
                    name: statusConfig[key]?.label ?? key,
                    value,
                    fill: statusConfig[key]?.color ?? '#94a3b8',
                })),
        [stats],
    );

    const trendChartData = useMemo(
        () => trendData.map((d) => ({ month: d.month, total: d.total })),
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
            <Head title="Mes retours" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* Header */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent" />
                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                        <RotateCcw className="h-4 w-4" />{' '}
                                        Gestion des retours
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        Mes retours
                                    </h1>
                                    <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
                                        Suivez vos demandes de retour et leur
                                        traitement.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                            <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Total retours
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <CountUp
                                                    start={0}
                                                    end={returns.total}
                                                    duration={1}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                En attente
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <CountUp
                                                    start={0}
                                                    end={stats.en_attente}
                                                    duration={1}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Graphiques */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <PieChart className="h-5 w-5 text-emerald-500" />{' '}
                                        Statuts des retours
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
                                                        label={({
                                                            name,
                                                            percent,
                                                        }) =>
                                                            percent != null
                                                                ? `${name} ${(percent * 100).toFixed(0)}%`
                                                                : name
                                                        }
                                                    />
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
                                                                backgroundColor:
                                                                    d.fill,
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
                                        Évolution des retours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {trendChartData.length > 0 ? (
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
                                                        id="colorReturns"
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
                                                <Area
                                                    type="monotone"
                                                    dataKey="total"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    fill="url(#colorReturns)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="py-8 text-center text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Liste des retours */}
                        <div className="space-y-4">
                            {returns.data.length > 0 ? (
                                returns.data.map((returnItem) => (
                                    <Card
                                        key={returnItem.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/70"
                                    >
                                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                    <Package className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {returnItem.commande
                                                            ?.numero_commande ??
                                                            'Commande'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {returnItem.motif ??
                                                            'Motif non précisé'}
                                                    </p>
                                                    {returnItem.date_demande && (
                                                        <p className="text-xs text-slate-400 dark:text-slate-500">
                                                            {new Date(
                                                                returnItem.date_demande,
                                                            ).toLocaleDateString(
                                                                'fr-FR',
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge
                                                    statut={returnItem.statut}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            'return.show',
                                                            returnItem.id,
                                                        )}
                                                    >
                                                        Voir le détail{' '}
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="rounded-2xl border border-dashed border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Aucun retour
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-500 dark:text-slate-400">
                                        Vos prochaines demandes de retour
                                        apparaîtront ici.
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
