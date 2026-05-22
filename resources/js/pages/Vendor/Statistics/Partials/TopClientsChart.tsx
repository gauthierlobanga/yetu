/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/static-components */

// resources/js/Pages/Vendor/Statistics/Partials/TopClientsChart.tsx

import { Crown, TrendingUp, Users, ShoppingBag, Sparkles } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopClient {
    id: number | string;
    name: string;
    avatar_url?: string | null;
    total_spent: number;
    orders_count: number;
}

interface Props {
    data: TopClient[];
}

const GRADIENT_COLORS = [
    ['#10b981', '#34d399'],
    ['#3b82f6', '#60a5fa'],
    ['#8b5cf6', '#a78bfa'],
    ['#f59e0b', '#fbbf24'],
    ['#06b6d4', '#22d3ee'],
];

const safeNumber = (v: any) => Number(v ?? 0) || 0;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(value);

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);

export function TopClientsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/70 dark:bg-slate-900/70">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                        Meilleurs clients
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .map((c) => ({
            ...c,
            total_spent: safeNumber(c.total_spent),
            orders_count: safeNumber(c.orders_count),
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 10);

    const chartData = sorted
        .map((client, idx) => ({
            name:
                client.name.length > 16
                    ? `${client.name.slice(0, 16)}...`
                    : client.name,
            fullName: client.name,
            value: client.total_spent,
            orders: client.orders_count,
            gradientId: `gradient-client-${idx}`,
            gradientColors: GRADIENT_COLORS[idx % GRADIENT_COLORS.length],
        }))
        .reverse();

    const totalRevenue = sorted.reduce((sum, c) => sum + c.total_spent, 0);

    const totalOrders = sorted.reduce((sum, c) => sum + c.orders_count, 0);

    const bestClient = sorted[0];

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0].payload;

        return (
            <div className="min-w-50 rounded-lg border border-slate-200/70 bg-white/95 p-4 backdrop-blur-xl transition-colors dark:border-slate-700/70 dark:bg-slate-900/95">
                <p className="font-semibold text-slate-900 dark:text-white">
                    {d.fullName}
                </p>

                <p className="mt-1 text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(d.value)}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {d.orders} commandes
                </p>
            </div>
        );
    };

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/40 dark:border-slate-800/70 dark:bg-slate-900/70">
            {/* Header */}
            <CardHeader className="space-y-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                    <div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Top clients
                        </Badge>

                        <CardTitle className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                            Meilleurs clients
                        </CardTitle>

                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            Classement des clients les plus rentables
                        </CardDescription>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200/60 bg-white/70 p-3 transition-colors hover:bg-emerald-500/5 dark:border-slate-800/60 dark:bg-slate-950/40">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Revenus
                            </div>

                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatCompactCurrency(totalRevenue)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/60 bg-white/70 p-3 transition-colors hover:bg-cyan-500/5 dark:border-slate-800/60 dark:bg-slate-950/40">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Commandes
                            </div>

                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {totalOrders}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best client */}
                <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {bestClient?.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Meilleur client
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="h-80 px-2 py-4 sm:px-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 10, right: 20 }}
                    >
                        <defs>
                            {chartData.map((entry) => (
                                <linearGradient
                                    key={entry.gradientId}
                                    id={entry.gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={entry.gradientColors[0]}
                                        stopOpacity={0.9}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={entry.gradientColors[1]}
                                        stopOpacity={1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid
                            horizontal={false}
                            stroke="rgba(148,163,184,0.15)"
                        />

                        <XAxis
                            type="number"
                            tick={{
                                fill: 'currentColor',
                                fontSize: 11,
                            }}
                            tickFormatter={formatCompactCurrency}
                        />

                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{
                                fill: 'currentColor',
                                fontSize: 12,
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Bar
                            dataKey="value"
                            barSize={22}
                            radius={[0, 10, 10, 0]}
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={`url(#${entry.gradientId})`}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
